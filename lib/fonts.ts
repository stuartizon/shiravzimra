import { Noto_Sans, EB_Garamond } from 'next/font/google'

export const notoSans = Noto_Sans({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
})

export const ebGaramond = EB_Garamond({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-eb-garamond',
})
