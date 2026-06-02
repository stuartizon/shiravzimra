import { Noto_Sans } from 'next/font/google'
import localFont from 'next/font/local'

export const notoSans = Noto_Sans({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
})

export const edwin = localFont({
  src: [
    { path: '../public/fonts/Edwin-Roman.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Edwin-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/Edwin-Italic.otf', weight: '400', style: 'italic' },
    { path: '../public/fonts/Edwin-BdIta.otf', weight: '700', style: 'italic' },
  ],
  variable: '--font-edwin',
})
