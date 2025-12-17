// Register ts-node so we can import TypeScript data in a Node script.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' }
});

const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFArray, PDFString, rgb, StandardFonts } = require('pdf-lib');
const { allSections, allGroups } = require('../data');
const { loadFonts } = require('./fonts');
const { computeSectionPagination, renderSectionContents } = require('./sectionToc');
const { renderGroupContents, computeGroupPagination } = require('./groupToc');
const { toRoman } = require('./utils');

function loadYoutubeIconPaths() {
  const svgPath = path.join(__dirname, 'assets', 'youtube.svg');
  const svg = fs.readFileSync(svgPath, 'utf8');
  const match = svg.match(/<path\s+d="([^"]+)"/i);
  if (!match) {
    throw new Error(`Unable to find <path d=\"...\"> in ${svgPath}`);
  }

  return {
    // Full YouTube logo mark shape (background + play triangle).
    full: match[1],
    // Triangle subpath extracted from our SVG (used to draw the play icon in white).
    play: 'M19,32v-14l12.19922,7z'
  };
}

function addExternalLinkAnnotation(pdf, page, rect, url) {
  const context = pdf.context;
  const linkAnnot = context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: rect,
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: PDFString.of(url)
    }
  });

  let annots = page.node.lookup(PDFName.of('Annots'));
  if (!annots) {
    annots = PDFArray.withContext(context);
    page.node.set(PDFName.of('Annots'), annots);
  }
  annots.push(linkAnnot);
}

async function mergeScores() {
  const scoresDir = path.join(__dirname, '..', 'public', 'scores');
  const introFile = path.join(__dirname, '..', 'public', 'introduction.pdf');
  const distDir = path.join(__dirname, '..', 'public', 'dist');
  const outputFile = path.join(distDir, 'all-scores.pdf');
  const fontsDir = path.join(__dirname, '..', 'fonts');
  const youtubeIcon = loadYoutubeIconPaths();

  if (!fs.existsSync(scoresDir)) {
    throw new Error(`Scores directory not found at ${scoresDir}`);
  }

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('🔨 Building merged PDF from data index...');
  console.log('📄 Loading piece PDFs...');

  const contentItems = allSections.flatMap((section) =>
    section.pieces.map((piece) => ({ section, piece }))
  );

  const loadedPieces = [];
  const pieceStartPages = new Map();
  let contentPageCounter = 0;

  for (const { piece } of contentItems) {
    const filePath = path.join(scoresDir, `${piece.id}.pdf`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing PDF file for piece id: ${piece.id}`);
    }

    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageIndices = pdfDoc.getPageIndices();

    const startPage = contentPageCounter + 1;
    pieceStartPages.set(piece.id, startPage);
    contentPageCounter += pageIndices.length;

    loadedPieces.push({ piece, pdfDoc, pageIndices });
  }

  const mergedPdf = await PDFDocument.create();

  const { bodyFont, bodyBoldFont, introTitleFont, hebrewFont } = await loadFonts(
    mergedPdf,
    fontsDir
  );
  const tocLinks = [];

  // Prepend introduction PDF (front matter)
  if (!fs.existsSync(introFile)) {
    throw new Error(`Introduction PDF not found at ${introFile}`);
  }
  console.log('📄 Adding introduction pages...');
  const introBytes = fs.readFileSync(introFile);
  const introDoc = await PDFDocument.load(introBytes);
  const introPageIndices = introDoc.getPageIndices();
  const introPages = await mergedPdf.copyPages(introDoc, introPageIndices);
  introPages.forEach((page) => mergedPdf.addPage(page));
  const introPageCount = introPages.length;

  // Compute section pagination (for section TOC pages)
  const sectionPagination = computeSectionPagination(mergedPdf, allSections, pieceStartPages, {
    bodyFont,
    titleFont: introTitleFont
  });
  const groupPagesEstimate = computeGroupPagination(mergedPdf, allGroups);
  const prefacePageIndex = introPageCount > 1 ? 1 : null;

  console.log('🧭 Generating table of contents...');
  // Group overview pages
  const groupPages = renderGroupContents(
    mergedPdf,
    allGroups,
    sectionPagination.sectionFirstPage,
    {
      bodyFont,
      bodyBoldFont,
      introTitleFont,
      hebrewFont
    },
    tocLinks,
    introPageCount + groupPagesEstimate - 1,
    prefacePageIndex
  );

  // Section-level TOC pages (with piece listings and links)
  const sectionPagesResult = renderSectionContents(
    mergedPdf,
    allSections,
    pieceStartPages,
    { bodyFont, bodyBoldFont, introTitleFont },
    tocLinks
  );

  const totalTocPages = groupPages + sectionPagesResult.sectionPageCount;

  console.log('📚 Merging piece PDFs...');

  for (const { piece, pdfDoc, pageIndices } of loadedPieces) {
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page, index) => {
      const mergedPage = mergedPdf.addPage(page);

      if (index !== 0) return;

      const { height } = mergedPage.getSize();
      const margin = 24;
      const size = 27;
      const scale = size / 50;
      const x = margin;
      const yLowerLeft = height - margin - size;
      const ySvg = yLowerLeft + size;

      const hasYoutube = typeof piece.youtubeUrl === 'string' && piece.youtubeUrl.length > 0;
      if (!hasYoutube) return;

      const backgroundColor = rgb(0.28, 0.28, 0.28);

      mergedPage.drawSvgPath(youtubeIcon.full, {
        x,
        y: ySvg,
        scale,
        color: backgroundColor
      });
      mergedPage.drawSvgPath(youtubeIcon.play, {
        x,
        y: ySvg,
        scale,
        color: rgb(1, 1, 1)
      });

      addExternalLinkAnnotation(
        mergedPdf,
        mergedPage,
        [x, yLowerLeft, x + size, yLowerLeft + size],
        piece.youtubeUrl
      );
    });
  }

  console.log('🔢 Adding page numbers...');

  const pages = mergedPdf.getPages();
  const fontSize = 10;
  const margin = 24;

  pages.forEach((page, index) => {
    // Introduction first page is intentionally unnumbered
    if (index === 0 && introPageCount > 0) return;

    let pageNumber;
    const tocStartIndex = introPageCount;
    const contentStartIndex = introPageCount + totalTocPages;

    if (index < contentStartIndex) {
      // Roman numbering for intro (after first page) + TOC
      pageNumber = toRoman(index);
    } else {
      // Arabic numbering for music pieces
      pageNumber = String(index - contentStartIndex + 1);
    }

    const { width } = page.getSize();
    const textWidth = bodyFont.widthOfTextAtSize(pageNumber, fontSize);
    const x = (width - textWidth) / 2;
    page.drawText(pageNumber, {
      x,
      y: margin,
      size: fontSize,
      font: bodyFont,
      color: rgb(0, 0, 0)
    });
  });

  addTocLinks(mergedPdf, tocLinks, totalTocPages, groupPages, introPageCount);

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputFile, mergedBytes);

  // Convert content-relative page numbers to document-absolute (includes intro + TOC pages)
  const docPageOffset = introPageCount + totalTocPages;
  const piecePageList = Array.from(pieceStartPages, ([id, contentPage]) => ({
    id,
    page: docPageOffset + contentPage
  }));

  // Section contents pages (absolute) so routes can link to section TOC pages
  const sectionPageOffset = introPageCount + groupPages;
  const sectionPageList = Array.from(sectionPagesResult.sectionFirstPage, ([id, page]) => ({
    id,
    page: sectionPageOffset + page
  }));

  // Preface (always the second page of the introduction if present)
  const prefacePageNumber = introPageCount > 1 ? 2 : null;
  const prefaceEntry = prefacePageNumber ? [{ id: 'preface', page: prefacePageNumber }] : [];

  // First Table of Contents page (immediately after introduction)
  const tocFirstPageNumber = introPageCount + 1;
  const tocEntry = [{ id: 'tableOfContents', page: tocFirstPageNumber }];

  const piecePageMapCombined = [...prefaceEntry, ...tocEntry, ...piecePageList, ...sectionPageList].sort(
    (a, b) => a.page - b.page
  );
  const mapPath = path.join(distDir, 'piece-page-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(piecePageMapCombined, null, 2));

  console.log(
    `✅ Merged ${loadedPieces.length} PDFs into ${path.relative(
      process.cwd(),
      outputFile
    )} (${mergedPdf.getPageCount()} pages total)`
  );
  console.log(`🗺️  Wrote piece page map to ${path.relative(process.cwd(), mapPath)}`);
}

function addTocLinks(pdf, links, tocPages, groupPages = 0, introPages = 0) {
  const pages = pdf.getPages();
  const context = pdf.context;

  links.forEach(({ tocPageIndex, targetPageNumber, sectionPage, rect, targetPageIndex }) => {
    let targetIndex = null;
    if (targetPageIndex != null) {
      targetIndex = targetPageIndex;
    } else if (sectionPage != null) {
      targetIndex = introPages + groupPages + sectionPage - 1;
    } else if (targetPageNumber != null) {
      targetIndex = introPages + tocPages + targetPageNumber - 1;
    }
    const tocPage = pages[tocPageIndex];
    const targetPage = pages[targetIndex];
    if (!tocPage || !targetPage) return;

    const linkAnnot = context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: rect,
      Border: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'GoTo',
        D: [targetPage.ref, PDFName.of('XYZ'), null, null, null]
      }
    });

    let annots = tocPage.node.lookup(PDFName.of('Annots'));
    if (!annots) {
      annots = PDFArray.withContext(context);
      tocPage.node.set(PDFName.of('Annots'), annots);
    }
    annots.push(linkAnnot);
  });
}

mergeScores().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
