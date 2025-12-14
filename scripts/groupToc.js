const { rgb } = require('pdf-lib');
const { layoutConfig, drawDotLeader, getPageSize } = require('./layout');
const { toRoman } = require('./utils');

function computeGroupPagination(pdf, groups) {
  const {
    margin,
    introHeaderSize,
    introLineHeight,
    sectionLineHeight,
    topPadding,
    headerGap,
    partGap
  } = layoutConfig;
  const { height } = getPageSize(pdf);

  let pageCount = 1;
  let y = height - margin - topPadding;
  y -= introHeaderSize + headerGap;

  // Preface entry
  if (y < margin + sectionLineHeight) {
    pageCount += 1;
    y = height - margin - topPadding;
  }
  y -= sectionLineHeight;

  groups.forEach((group) => {
    y -= partGap;
    const neededHeight = introLineHeight + group.sections.length * sectionLineHeight;
    if (y < margin + neededHeight) {
      pageCount += 1;
      y = height - margin - topPadding;
    }
    y -= introLineHeight;

    group.sections.forEach(() => {
      if (y < margin + sectionLineHeight) {
        pageCount += 1;
        y = height - margin - topPadding;
      }
      y -= sectionLineHeight;
    });
  });

  return pageCount;
}

function renderGroupContents(
  pdf,
  groups,
  sectionTocPages,
  fonts,
  linkRecords = [],
  pageOffset = 0,
  prefacePageIndex = null
) {
  const { bodyFont, bodyBoldFont, introTitleFont, hebrewFont } = fonts;
  const {
    margin,
    introHeaderSize,
    introLineSize,
    introLineHeight,
    sectionLineSize,
    sectionLineHeight,
    topPadding,
    headerGap,
    partGap,
    leaderGap,
    partLineSize
  } = layoutConfig;

  const safeText = (text) =>
    text
      .split('')
      .map((ch) => (ch.charCodeAt(0) <= 255 ? ch : '?'))
      .join('');

  let pageCount = 0;
  let page = pdf.addPage();
  pageCount += 1;
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

  if (prefacePageIndex != null) {
    if (y < margin + sectionLineHeight) {
      page = pdf.addPage();
      pageCount += 1;
      ({ width, height } = page.getSize());
      y = height - margin - topPadding;
    }
    const prefaceLabel = 'Preface';
    const prefaceLabelWidth = bodyFont.widthOfTextAtSize(prefaceLabel, sectionLineSize);
    const pageText = toRoman(prefacePageIndex);
    const pageWidth = bodyBoldFont.widthOfTextAtSize(pageText, sectionLineSize);
    const leftX = margin;
    const pageX = width - margin - pageWidth;

    page.drawText(prefaceLabel, {
      x: leftX,
      y,
      size: sectionLineSize,
      font: bodyFont,
      color: rgb(0, 0, 0)
    });

    drawDotLeader(page, leftX + prefaceLabelWidth + leaderGap, pageX - leaderGap, y, bodyFont, sectionLineSize, rgb(0, 0, 0));
    page.drawText(pageText, {
      x: pageX,
      y,
      size: sectionLineSize,
      font: bodyBoldFont,
      color: rgb(22 / 255, 101 / 255, 52 / 255)
    });

    const tocPageIndex = pdf.getPageCount() - 1;
    linkRecords.push({
      tocPageIndex,
      targetPageIndex: prefacePageIndex,
      rect: [pageX, y, pageX + pageWidth, y + sectionLineSize]
    });

    y -= sectionLineHeight;
  }

  groups.forEach((group, idx) => {
    y -= partGap;
    const leftText = `PART ${idx + 1}: ${group.name.toUpperCase()}`;
    const lineWidth = bodyFont.widthOfTextAtSize(leftText, partLineSize);
    const lineX = (width - lineWidth) / 2;
    const neededHeight = introLineHeight + group.sections.length * sectionLineHeight;
    if (y < margin + neededHeight) {
      page = pdf.addPage();
      pageCount += 1;
      ({ width, height } = page.getSize());
      y = height - margin - topPadding;
    }
    page.drawText(leftText, { x: lineX, y, size: partLineSize, font: bodyFont, color: rgb(0, 0, 0) });
    y -= introLineHeight;

    group.sections.forEach((section) => {
      if (y < margin + sectionLineHeight) {
        page = pdf.addPage();
        pageCount += 1;
        ({ width, height } = page.getSize());
        y = height - margin - topPadding;
      }
      const sectionText = section.shortName || section.name || section.id;
      const sectionWidth = bodyFont.widthOfTextAtSize(sectionText, sectionLineSize);
      const sectionPage = sectionTocPages.get(section.id);
      const pageText = sectionPage ? toRoman(sectionPage + pageOffset) : '';
      const pageWidth = bodyBoldFont.widthOfTextAtSize(pageText, sectionLineSize);
      const leftX = margin;
      const pageX = width - margin - pageWidth;

      page.drawText(sectionText, {
        x: leftX,
        y,
        size: sectionLineSize,
        font: bodyFont,
        color: rgb(0, 0, 0)
      });

      if (pageText) {
        drawDotLeader(
          page,
          leftX + sectionWidth + leaderGap,
          pageX - leaderGap,
          y,
          bodyFont,
          sectionLineSize,
          rgb(0, 0, 0)
        );
        page.drawText(pageText, {
          x: pageX,
          y,
          size: sectionLineSize,
          font: bodyBoldFont,
          color: rgb(22 / 255, 101 / 255, 52 / 255)
        });
        const tocPageIndex = pdf.getPageCount() - 1;
        linkRecords.push({
          tocPageIndex,
          sectionPage,
          rect: [pageX, y, pageX + pageWidth, y + sectionLineSize]
        });
      }

      y -= sectionLineHeight;
    });
  });

  return pageCount;
}

module.exports = {
  renderGroupContents,
  computeGroupPagination
};
