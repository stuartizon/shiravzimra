const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function mergeScores() {
  const scoresDir = path.join(__dirname, '..', 'public', 'scores');
  const distDir = path.join(__dirname, '..', 'dist');
  const outputFile = path.join(distDir, 'all-scores.pdf');

  if (!fs.existsSync(scoresDir)) {
    throw new Error(`Scores directory not found at ${scoresDir}`);
  }

  const files = fs
    .readdirSync(scoresDir)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (files.length === 0) {
    throw new Error(`No PDF files found in ${scoresDir}`);
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const filePath = path.join(scoresDir, file);
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
