import { Html, Head, Main, NextScript } from 'next/document'
import { notoSans, ebGaramond } from '../lib/fonts'

export default function Document() {
  return (
    <Html className={`${notoSans.variable} ${ebGaramond.variable}`}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
