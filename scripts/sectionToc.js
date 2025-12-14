const { rgb } = require('pdf-lib');
const { computeTocLayout, drawDotLeader, getPageSize, layoutConfig } = require('./layout');

function computeSectionPagination(pdf, sections, pieceStartPages, fonts) {
  const { margin, titleSize, lineHeight, headerGap, topPadding } = layoutConfig;
  const { height } = getPageSize(pdf);
  const sectionFirstPage = new Map();
  let pageCount = 0;

  sections.forEach((section) => {
    pageCount += 1;
    sectionFirstPage.set(section.id, pageCount);
    let y = height - margin - topPadding - (titleSize + headerGap);

    section.pieces.forEach(() => {
      if (y < margin + lineHeight) {
        pageCount += 1;
        y = height - margin - topPadding - (titleSize + headerGap);
      } else {
        y -= lineHeight;
      }
    });
  });

  return { sectionPageCount: pageCount, sectionFirstPage };
}

function renderSectionContents(pdf, sections, pieceStartPages, fonts, linkRecords) {
  const { bodyFont, bodyBoldFont, introTitleFont } = fonts;
  const {
    margin,
    titleSize,
    lineSize,
    lineHeight,
    headerGap,
    topPadding,
    leaderGap
  } = layoutConfig;

  const overlaps = [];
  let pageCount = 0;

  const maxContentPage = pieceStartPages.size ? Math.max(...pieceStartPages.values()) : 0;
  const layout = computeTocLayout(
    sections,
    pieceStartPages,
    maxContentPage,
    bodyFont,
    lineSize,
    margin,
    getPageSize(pdf).width
  );

  const sectionFirstPage = new Map();

  sections.forEach((section) => {
    let page = pdf.addPage();
    pageCount += 1;
    let { width, height } = page.getSize();
    let y = height - margin - topPadding;

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
    sectionFirstPage.set(section.id, pageCount);

    section.pieces.forEach((piece) => {
      const pageNumber = pieceStartPages.get(piece.id);

      if (y < margin + lineHeight) {
        page = pdf.addPage();
        pageCount += 1;
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
        const displayText = String(pageNumber);
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

  return { sectionPageCount: pageCount, sectionFirstPage };
}

module.exports = {
  computeSectionPagination,
  renderSectionContents
};
