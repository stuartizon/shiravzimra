// Register ts-node so we can import TypeScript data in a Node script.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' }
});
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { allPieces } = require('../data');

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

  for (const { filePath, pieceId } of files) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputFile, mergedBytes);

  console.log(`Merged ${files.length} PDFs into ${path.relative(process.cwd(), outputFile)}`);
}

mergeScores().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
