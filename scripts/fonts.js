const fs = require('fs');
const path = require('path');
const fontkit = require('@pdf-lib/fontkit');
const { StandardFonts } = require('pdf-lib');

function resolveFontPath(fontsDir, candidates) {
  if (!fontsDir || !fs.existsSync(fontsDir)) return null;
  for (const candidate of candidates) {
    const candidatePath = path.join(fontsDir, candidate);
    if (fs.existsSync(candidatePath)) return candidatePath;
  }
  return null;
}

async function loadFonts(pdf, fontsDir) {
  pdf.registerFontkit(fontkit);

  const edwinFontPath = resolveFontPath(fontsDir, ['Edwin-Roman.otf', 'Edwin.otf']);
  const edwinBoldPath = resolveFontPath(fontsDir, ['Edwin-Bold.otf', 'EdwinBold.otf', 'Edwin.otf']);

  const fallbackBody = await pdf.embedFont(StandardFonts.TimesRoman);
  const fallbackBold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const bodyFont = edwinFontPath
    ? await pdf.embedFont(fs.readFileSync(edwinFontPath))
    : fallbackBody;
  const bodyBoldFont = edwinBoldPath
    ? await pdf.embedFont(fs.readFileSync(edwinBoldPath))
    : bodyFont;

  // If we didn't have a bold file, fall back to a standard bold font so numbers/links still stand out.
  const effectiveBoldFont = edwinBoldPath ? bodyBoldFont : fallbackBold;

  const titleFont = bodyFont;
  const introTitleFont = bodyFont;

  return {
    bodyFont,
    bodyBoldFont: effectiveBoldFont,
    titleFont,
    introTitleFont
  };
}

module.exports = {
  loadFonts
};
