// Register ts-node so we can import TypeScript data in a Node script.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' }
});
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb, PDFName, PDFArray } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const { allSections, allGroups } = require('../data');

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
  mergedPdf.registerFontkit(fontkit);

  const serifRegularPath = resolveFontPath(
    fontsDir,
    ['NotoSerif-Regular.ttf', 'NotoSerif.ttf', 'NotoSerif-VariableFont_wght.ttf', 'NotoSerif[wght].ttf'],
    ['notoserif']
  );
  const serifBoldPath = resolveFontPath(
    fontsDir,
    ['NotoSerif-Bold.ttf', 'NotoSerif-Bold.ttf', 'NotoSerif-VariableFont_wght.ttf', 'NotoSerif[wght].ttf'],
    ['notoserif', 'bold']
  );
  const hebrewFontPath = resolveFontPath(
    fontsDir,
    ['NotoSerifHebrew-Regular.ttf', 'NotoSerifHebrew.ttf', 'NotoSerifHebrew-VariableFont_wght.ttf', 'NotoSerifHebrew[wght].ttf'],
    ['notoserifhebrew']
  );
  const edwinFontPath = resolveFontPath(
    fontsDir,
    ['Edwin-Roman.otf', 'Edwin.ttf', 'Edwin-Regular.ttf', 'Edwin.otf'],
    ['edwin']
  );
  const edwinBoldPath = resolveFontPath(
    fontsDir,
    ['Edwin-Bold.otf', 'Edwin-Bold.ttf', 'EdwinBold.ttf', 'Edwin.otf'],
    ['edwin', 'bold']
  );

  const fallbackBody = await mergedPdf.embedFont(StandardFonts.TimesRoman);
  const fallbackBold = await mergedPdf.embedFont(StandardFonts.TimesRomanBold);

  const bodyFont = await embedFontOrFallback(
    mergedPdf,
    edwinFontPath || serifRegularPath,
    fallbackBody,
    'Edwin'
  );
  const bodyBoldFont = await embedFontOrFallback(
    mergedPdf,
    edwinBoldPath || edwinFontPath || serifBoldPath || serifRegularPath,
    fallbackBold,
    'Edwin Bold'
  );
  const titleFont = bodyFont;
  const introTitleFont = bodyFont;

  let hebrewFont = null;
  if (hebrewFontPath && fs.existsSync(hebrewFontPath)) {
    const hebrewBytes = fs.readFileSync(hebrewFontPath);
    hebrewFont = await mergedPdf.embedFont(hebrewBytes);
  } else {
    console.warn(
      `Hebrew font not found at ${
        hebrewFontPath ? path.relative(process.cwd(), hebrewFontPath) : '[not provided]'
      }; Hebrew names may be degraded.`
    );
  }
  const tocLinks = [];

  console.log('🧭 Generating table of contents...');
  const tocPages = addTableOfContents(
    mergedPdf,
    allGroups,
    allSections,
    pieceStartPages,
    contentPageCounter,
    bodyFont,
    bodyBoldFont,
    titleFont,
    introTitleFont,
    tocLinks,
    hebrewFont
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
  groups,
  sections,
  pieceStartPages,
  totalContentPages,
  bodyFont,
  bodyBoldFont,
  titleFont,
  introTitleFont,
  linkRecords,
  hebrewFont
) {
  const startPageCount = pdf.getPageCount();
  const margin = 50;
  const titleSize = 24; // ~1.5rem
  const lineSize = 14; // slightly tighter to fit columns
  const lineHeight = 19;
  const headerGap = 18;
  const topPadding = 2 * 16; // 2rem in points (approx, assuming 16px baseline)
  const introHeaderSize = 26;
  const introLineSize = 16;
  const introLineHeight = 24;
  const overlaps = [];
  const leaderGap = 3;
  const safeText = (text) =>
    text
      .split('')
      .map((ch) => (ch.charCodeAt(0) <= 255 ? ch : '?'))
      .join('');

  const layout = computeTocLayout(
    sections,
    pieceStartPages,
    totalContentPages,
    bodyFont,
    lineSize,
    margin,
    getPageWidth(pdf)
  );

  // Intro page listing parts/groups
  let page = pdf.addPage();
  let { width, height } = page.getSize();
  let y = height - margin - topPadding;

  const introTitle = 'TABLE OF CONTENTS';
  const introTitleWidth = introTitleFont.widthOfTextAtSize(introTitle, introHeaderSize);
  page.drawText(introTitle, {
    x: (width - introTitleWidth) / 2,
    y,
    size: introHeaderSize,
    font: introTitleFont,
    color: rgb(0, 0, 0)
  });
  y -= introHeaderSize + headerGap;

  groups.forEach((group, idx) => {
    const leftText = `Part ${idx + 1}: ${group.name.toUpperCase()} – `;
    const hebrewText = hebrewFont ? group.hebrewName || '' : safeText(group.hebrewName || '');
    const leftWidth = bodyFont.widthOfTextAtSize(leftText, introLineSize);
    const hebrewWidth = (hebrewFont || bodyFont).widthOfTextAtSize(hebrewText, introLineSize);
    const totalWidth = leftWidth + hebrewWidth;
    const lineX = (width - totalWidth) / 2;
    if (y < margin + introLineHeight) {
      page = pdf.addPage();
      ({ width, height } = page.getSize());
      y = height - margin - topPadding;
    }
    page.drawText(leftText, { x: lineX, y, size: introLineSize, font: bodyFont, color: rgb(0, 0, 0) });
    page.drawText(hebrewText, {
      x: lineX + leftWidth,
      y,
      size: introLineSize,
      font: hebrewFont || bodyFont,
      color: rgb(0, 0, 0)
    });
    y -= introLineHeight;
  });

  // Section-level TOCs follow
  sections.forEach((section) => {
    page = pdf.addPage();
    ({ width, height } = page.getSize());
    y = height - margin - topPadding;

    const sectionTitle = section.name;

    const drawHeader = () => {
      const titleText = sectionTitle.toUpperCase();
      const titleWidth = introTitleFont.widthOfTextAtSize(titleText, titleSize);
      const x = (width - titleWidth) / 2;
      page.drawText(titleText, {
        x,
        y,
        size: titleSize,
        font: introTitleFont,
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
      const authorStart = layout.authorX;
      drawDotLeader(page, nameEnd + leaderGap, authorStart - leaderGap, y, bodyFont, lineSize, rgb(0, 0, 0));

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
        drawDotLeader(page, authorEnd + leaderGap, pageX - leaderGap, y, bodyFont, lineSize, rgb(0, 0, 0));
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
    name: 240,
    author: 170,
    id: 20,
    page: 30
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

function drawDotLeader(page, fromX, toX, y, font, fontSize, color) {
  if (fromX >= toX) return;
  const dot = '.';
  const dotWidth = font.widthOfTextAtSize(dot, fontSize);
  let x = fromX;
  while (x + dotWidth <= toX) {
    page.drawText(dot, {
      x,
      y,
      size: fontSize,
      font,
      color: color ?? rgb(0, 0, 0)
    });
    x += dotWidth;
  }
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

function embedFontOrFallback(pdf, fontPath, fallbackFont, label) {
  if (fontPath && fs.existsSync(fontPath)) {
    const fontBytes = fs.readFileSync(fontPath);
    return pdf.embedFont(fontBytes);
  }
  console.warn(
    `${label} font not found at ${
      fontPath ? path.relative(process.cwd(), fontPath) : '[not provided]'
    }; using fallback.`
  );
  return fallbackFont;
}

function resolveFontPath(fontsDir, candidates, keywords = []) {
  if (!fs.existsSync(fontsDir)) return null;
  for (const candidate of candidates) {
    const candidatePath = path.join(fontsDir, candidate);
    if (fs.existsSync(candidatePath) && !/italic/i.test(candidate)) return candidatePath;
  }
  if (keywords.length > 0) {
    const files = fs.readdirSync(fontsDir);
    const match = files.find((file) =>
      !/italic/i.test(file) && keywords.every((k) => file.toLowerCase().includes(k.toLowerCase()))
    );
    if (match) return path.join(fontsDir, match);
  }
  return null;
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
