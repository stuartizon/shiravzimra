import { Html, Head, Main, NextScript } from 'next/document'
import { notoSans, tiroDevanagariHindi } from '../lib/fonts'

export default function Document() {
  return (
    <Html className={`${notoSans.variable} ${tiroDevanagariHindi.variable}`}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
