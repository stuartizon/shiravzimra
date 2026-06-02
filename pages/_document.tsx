import { Html, Head, Main, NextScript } from 'next/document'
import { notoSans, edwin } from '../lib/fonts'

export default function Document() {
  return (
    <Html className={`${notoSans.variable} ${edwin.variable}`}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
