// Register ts-node so we can import TypeScript data in a Node script.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' }
});
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { allPieces, allSections } = require('../data');

async function mergeScores() {
  const scoresDir = path.join(__dirname, '..', 'public', 'scores');
  const distDir = path.join(__dirname, '..', 'dist');
  const outputFile = path.join(distDir, 'all-scores.pdf');

  if (!fs.existsSync(scoresDir)) {
    throw new Error(`Scores directory not found at ${scoresDir}`);
  }

  const files = allPieces.map((piece) => {
    const filePath = path.join(scoresDir, `${piece.id}.pdf`);
    return { pieceId: piece.id, filePath };
  });

  const missing = files.filter(({ filePath }) => !fs.existsSync(filePath));
  if (missing.length > 0) {
    const missingList = missing.map((m) => m.pieceId).join(', ');
    throw new Error(`Missing PDF files for piece ids: ${missingList}`);
  }

  const mergedPdf = await PDFDocument.create();
  const bodyFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const titleFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

  const tocPages = addTableOfContents(mergedPdf, allSections, bodyFont, titleFont);

  for (const { filePath, pieceId } of files) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

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

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputFile, mergedBytes);

  console.log(`Merged ${files.length} PDFs into ${path.relative(process.cwd(), outputFile)}`);
}

function addTableOfContents(pdf, sections, bodyFont, titleFont) {
  const startPageCount = pdf.getPageCount();
  const margin = 50;
  const titleSize = 16;
  const lineSize = 12;
  const lineHeight = 16;

  sections.forEach((section) => {
    let page = pdf.addPage();
    let { width, height } = page.getSize();
    let y = height - margin;

    const sectionTitle = section.name;

    const drawHeader = () => {
      page.drawText(sectionTitle, {
        x: margin,
        y,
        size: titleSize,
        font: titleFont,
        color: rgb(0, 0, 0)
      });
      y -= titleSize + 12;
    };

    drawHeader();

    section.pieces.forEach((piece) => {
      if (y < margin + lineHeight) {
        page = pdf.addPage();
        ({ width, height } = page.getSize());
        y = height - margin;
        drawHeader();
      }

      page.drawText(piece.name, {
        x: margin,
        y,
        size: lineSize,
        font: bodyFont,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
    });
  });

  return pdf.getPageCount() - startPageCount;
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
