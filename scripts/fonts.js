const fs = require('fs');
const path = require('path');
const fontkit = require('@pdf-lib/fontkit');
const { StandardFonts } = require('pdf-lib');

function resolveFontPath(fontsDir, candidates, keywords = []) {
  if (!fontsDir || !fs.existsSync(fontsDir)) return null;
  for (const candidate of candidates) {
    const candidatePath = path.join(fontsDir, candidate);
    if (fs.existsSync(candidatePath) && !/italic/i.test(candidate)) return candidatePath;
  }
  if (keywords.length > 0) {
    const files = fs.readdirSync(fontsDir);
    const match = files.find(
      (file) => !/italic/i.test(file) && keywords.every((k) => file.toLowerCase().includes(k.toLowerCase()))
    );
    if (match) return path.join(fontsDir, match);
  }
  return null;
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

async function loadFonts(pdf, fontsDir) {
  pdf.registerFontkit(fontkit);

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

  const fallbackBody = await pdf.embedFont(StandardFonts.TimesRoman);
  const fallbackBold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const bodyFont = await embedFontOrFallback(pdf, edwinFontPath || serifRegularPath, fallbackBody, 'Edwin');
  const bodyBoldFont = await embedFontOrFallback(
    pdf,
    edwinBoldPath || edwinFontPath || serifBoldPath || serifRegularPath,
    fallbackBold,
    'Edwin Bold'
  );
  const titleFont = bodyFont;
  const introTitleFont = bodyFont;

  let hebrewFont = null;
  if (hebrewFontPath && fs.existsSync(hebrewFontPath)) {
    const hebrewBytes = fs.readFileSync(hebrewFontPath);
    hebrewFont = await pdf.embedFont(hebrewBytes);
  } else {
    console.warn(
      `Hebrew font not found at ${
        hebrewFontPath ? path.relative(process.cwd(), hebrewFontPath) : '[not provided]'
      }; Hebrew names may be degraded.`
    );
  }

  return {
    bodyFont,
    bodyBoldFont,
    titleFont,
    introTitleFont,
    hebrewFont
  };
}

module.exports = {
  loadFonts,
  resolveFontPath,
  embedFontOrFallback
};
