// Register ts-node so we can import TypeScript data in a Node script.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' }
});

const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFArray, rgb, StandardFonts } = require('pdf-lib');
const { allSections, allGroups } = require('../data');
const { loadFonts } = require('./fonts');
const { computeSectionPagination, renderSectionContents } = require('./sectionToc');
const { renderGroupContents } = require('./groupToc');
const { toRoman } = require('./utils');

async function mergeScores() {
  const scoresDir = path.join(__dirname, '..', 'public', 'scores');
  const distDir = path.join(__dirname, '..', 'dist');
  const outputFile = path.join(distDir, 'all-scores.pdf');
  const fontsDir = path.join(__dirname, '..', 'fonts');

  if (!fs.existsSync(scoresDir)) {
    throw new Error(`Scores directory not found at ${scoresDir}`);
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

  // Compute section pagination (for section TOC pages)
  const sectionPagination = computeSectionPagination(mergedPdf, allSections, pieceStartPages, {
    bodyFont,
    titleFont: introTitleFont
  });

  console.log('🧭 Generating table of contents...');
  // Group overview pages (unnumbered)
  const groupPages = renderGroupContents(mergedPdf, allGroups, sectionPagination.sectionFirstPage, {
    bodyFont,
    introTitleFont,
    hebrewFont
  });

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

  for (const { pdfDoc, pageIndices } of loadedPieces) {
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  console.log('🔢 Adding page numbers...');

  const pages = mergedPdf.getPages();
  const fontSize = 10;
  const margin = 24;

  pages.forEach((page, index) => {
    // Intro/group pages: no numbers
    if (index < groupPages) return;

    let pageNumber;
    if (index < totalTocPages) {
      pageNumber = toRoman(index - groupPages + 1);
    } else {
      pageNumber = `${index - totalTocPages + 1}`;
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

  addTocLinks(mergedPdf, tocLinks, totalTocPages);

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputFile, mergedBytes);

  console.log(
    `✅ Merged ${loadedPieces.length} PDFs into ${path.relative(
      process.cwd(),
      outputFile
    )} (${mergedPdf.getPageCount()} pages total)`
  );
}

function addTocLinks(pdf, links, tocPages) {
  const pages = pdf.getPages();
  const context = pdf.context;

  links.forEach(({ tocPageIndex, targetPageNumber, rect }) => {
    const targetIndex = tocPages + targetPageNumber - 1;
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
