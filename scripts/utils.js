function toRoman(num) {
  if (num <= 0 || num > 100) return String(num);

  const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', 'C'];
  const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  const t = Math.floor(num / 10);
  const o = num % 10;

  return `${tens[t]}${ones[o]}`.toLowerCase();
}

module.exports = {
  toRoman
};
