import { Noto_Sans, Tiro_Devanagari_Hindi } from 'next/font/google'

export const notoSans = Noto_Sans({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
})

export const tiroDevanagariHindi = Tiro_Devanagari_Hindi({
  weight: '400',
  subsets: ['latin', 'devanagari'],
  variable: '--font-tiro-devanagari',
})
