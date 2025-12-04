// Register ts-node so we can import TypeScript data in a Node script.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' }
});
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb, PDFName, PDFArray } = require('pdf-lib');
const { allSections } = require('../data');

async function mergeScores() {
  const scoresDir = path.join(__dirname, '..', 'public', 'scores');
  const distDir = path.join(__dirname, '..', 'dist');
  const outputFile = path.join(distDir, 'all-scores.pdf');

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

  for (const { section, piece } of contentItems) {
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

    loadedPieces.push({ section, piece, pdfDoc, pageIndices });
  }

  const mergedPdf = await PDFDocument.create();
  const bodyFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const bodyBoldFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  const titleFont = await mergedPdf.embedFont(StandardFonts.TimesRomanBold);
  const tocLinks = [];

  console.log('🧭 Generating table of contents...');
  const tocPages = addTableOfContents(
    mergedPdf,
    allSections,
    pieceStartPages,
    contentPageCounter,
    bodyFont,
    bodyBoldFont,
    titleFont,
    tocLinks
  );

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
    const pageNumber =
      index < tocPages ? toRoman(index + 1) : `${index - tocPages + 1}`;
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

  addTocLinks(mergedPdf, tocLinks, tocPages);

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

function addTableOfContents(
  pdf,
  sections,
  pieceStartPages,
  totalContentPages,
  bodyFont,
  bodyBoldFont,
  titleFont,
  linkRecords
) {
  const startPageCount = pdf.getPageCount();
  const margin = 50;
  const titleSize = 24; // ~1.5rem
  const lineSize = 14; // slightly tighter to fit columns
  const lineHeight = 19;
  const headerGap = 18;
  const topPadding = 2 * 16; // 2rem in points (approx, assuming 16px baseline)
  const overlaps = [];

  const layout = computeTocLayout(
    sections,
    pieceStartPages,
    totalContentPages,
    bodyFont,
    lineSize,
    margin,
    getPageWidth(pdf)
  );

  sections.forEach((section) => {
    let page = pdf.addPage();
    let { width, height } = page.getSize();
    let y = height - margin - topPadding;

    const sectionTitle = section.name;

    const drawHeader = () => {
      const titleText = sectionTitle.toUpperCase();
      const titleWidth = titleFont.widthOfTextAtSize(titleText, titleSize);
      const x = (width - titleWidth) / 2;
      page.drawText(titleText, {
        x,
        y,
        size: titleSize,
        font: titleFont,
        color: rgb(0, 0, 0)
      });
      y -= titleSize + headerGap;
    };

    drawHeader();

    section.pieces.forEach((piece) => {
      const pageNumber = pieceStartPages.get(piece.id);

      if (y < margin + lineHeight) {
        page = pdf.addPage();
        ({ width, height } = page.getSize());
        y = height - margin;
        drawHeader();
      }

      page.drawText(piece.id, {
        x: layout.idX,
        y,
        size: lineSize,
        font: bodyFont,
        color: rgb(0, 0, 0)
      });

      const idEnd = layout.idX + bodyFont.widthOfTextAtSize(piece.id, lineSize);

      page.drawText(piece.name, {
        x: layout.nameX,
        y,
        size: lineSize,
        font: bodyFont,
        color: rgb(0, 0, 0)
      });

      const nameEnd = layout.nameX + bodyFont.widthOfTextAtSize(piece.name, lineSize);

      page.drawText(piece.author, {
        x: layout.authorX,
        y,
        size: lineSize,
        font: bodyFont,
        color: rgb(0, 0, 0)
      });

      const authorEnd = layout.authorX + bodyFont.widthOfTextAtSize(piece.author, lineSize);

      if (pageNumber != null) {
        const pageText = String(pageNumber);
        const displayText = pageText;
        const pageTextWidth = bodyBoldFont.widthOfTextAtSize(displayText, lineSize);
        const pageX = layout.pageX + layout.pageWidth - pageTextWidth;
        const linkColor = rgb(22 / 255, 101 / 255, 52 / 255);
        page.drawText(displayText, {
          x: pageX,
          y,
          size: lineSize,
          font: bodyBoldFont,
          color: linkColor
        });
        const pageIndex = pdf.getPageCount() - 1;
        linkRecords.push({
          tocPageIndex: pageIndex,
          targetPageNumber: pageNumber,
          rect: [pageX, y, pageX + pageTextWidth, y + lineSize]
        });
      }

      y -= lineHeight;

      const pageStart = layout.pageX;
      if (idEnd > layout.nameX || nameEnd > layout.authorX || authorEnd > pageStart) {
        overlaps.push({
          section: section.id,
          piece: piece.id,
          idEnd,
          nameEnd,
          authorEnd,
          nameStart: layout.nameX,
          authorStart: layout.authorX,
          pageStart
        });
      }
    });
  });

  if (overlaps.length > 0) {
    console.warn('TOC overlaps detected:', overlaps);
  }

  return pdf.getPageCount() - startPageCount;
}

function computeTocLayout(
  sections,
  pieceStartPages,
  totalContentPages,
  font,
  fontSize,
  margin,
  pageWidth
) {
  const padding = 8;
  const minWidths = {
    name: 218,
    author: 100,
    id: 50,
    page: 40
  };

  const pieces = sections.flatMap((section) =>
    section.pieces.map((piece) => ({
      name: piece.name || '',
      author: piece.author || '',
      id: piece.id || '',
      page: pieceStartPages.get(piece.id)
    }))
  );

  const measure = (text = '') => font.widthOfTextAtSize(text, fontSize);

  let idWidth = Math.max(minWidths.id, Math.max(...pieces.map((p) => measure(p.id)), 0) + padding);
  let nameWidth = Math.max(
    minWidths.name,
    Math.max(...pieces.map((p) => measure(p.name)), 0) + padding
  );
  let authorWidth = Math.max(
    minWidths.author,
    Math.max(...pieces.map((p) => measure(p.author)), 0) + padding
  );
  const widestPageNumber = String(totalContentPages || 0);
  let pageWidthCol = Math.max(minWidths.page, measure(widestPageNumber) + padding);

  const available = pageWidth - margin * 2;
  let widths = [idWidth, nameWidth, authorWidth, pageWidthCol];
  const mins = [minWidths.id, minWidths.name, minWidths.author, minWidths.page];

  const reduceIfNeeded = () => {
    let total = widths.reduce((sum, val) => sum + val, 0);
    let overflow = total - available;
    if (overflow <= 0) return;

    for (let i = 0; i < widths.length && overflow > 0; i++) {
      const reducible = widths[i] - mins[i];
      if (reducible <= 0) continue;
      const delta = Math.min(reducible, overflow);
      widths[i] -= delta;
      overflow -= delta;
    }
  };

  reduceIfNeeded();

  [idWidth, nameWidth, authorWidth, pageWidthCol] = widths;

  return {
    idX: margin,
    nameX: margin + idWidth,
    authorX: margin + idWidth + nameWidth,
    pageX: margin + idWidth + nameWidth + authorWidth,
    pageWidth: pageWidthCol
  };
}

function getPageWidth(pdf) {
  const tempPage = pdf.addPage();
  const { width } = tempPage.getSize();
  pdf.removePage(pdf.getPageCount() - 1);
  return width;
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

function toRoman(num) {
  const lookup = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1]
  ];

  let result = '';
  let n = num;

  lookup.forEach(([symbol, value]) => {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  });

  return result.toLowerCase();
}

mergeScores().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
