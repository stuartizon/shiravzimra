const { rgb } = require('pdf-lib');
const { layoutConfig, drawDotLeader } = require('./layout');
const { toRoman } = require('./utils');

function renderGroupContents(pdf, groups, sectionTocPages, fonts, linkRecords = []) {
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
      const pageText = sectionPage ? toRoman(sectionPage) : '';
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
  renderGroupContents
};
