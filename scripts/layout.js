const { rgb } = require('pdf-lib');

const layoutConfig = {
  margin: 50,
  titleSize: 28,
  lineSize: 14,
  lineHeight: 19,
  headerGap: 18,
  topPadding: 32,
  introHeaderSize: 28,
  introLineSize: 16,
  introLineHeight: 24,
  sectionLineSize: 14,
  sectionLineHeight: 18,
  partGap: 30,
  leaderGap: 3,
  partLineSize: 20
};

function computeTocLayout(
  sections,
  pieceStartPages,
  totalContentPages,
  font,
  fontSize,
  margin,
  pageWidth,
  formatPageNumber = String
) {
  const padding = 8;
  const minWidths = {
    id: 40,
    name: 230,
    author: 180,
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
  const widestPageNumber = formatPageNumber(totalContentPages || 0);
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

function getPageSize(pdf) {
  const tempPage = pdf.addPage();
  const size = tempPage.getSize();
  pdf.removePage(pdf.getPageCount() - 1);
  return size;
}

function drawDotLeader(page, fromX, toX, y, font, fontSize, color = rgb(0, 0, 0)) {
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
      color
    });
    x += dotWidth;
  }
}

module.exports = {
  layoutConfig,
  computeTocLayout,
  getPageSize,
  drawDotLeader
};
