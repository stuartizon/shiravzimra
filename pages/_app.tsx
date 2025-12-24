import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Main from '../components/main/Main'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import Head from 'next/head'
import Script from 'next/script'
import { useState } from 'react'

const App = ({ Component, pageProps }: AppProps) => {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <Main scrollLocked={mobileMenu}>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <meta property='og:image' content='https://www.shiravzimra.com/opengraph.png' />
        <meta name='twitter:image' content='https://www.shiravzimra.com/opengraph.png' />
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-9TFRCWQ7E8" async={true} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9TFRCWQ7E8');
        `}
      </Script>
      <Nav
        showMobileMenu={mobileMenu}
        onClickMenu={() => setMobileMenu(!mobileMenu)}
      />
      <div className='flex-1 z-0'>
        <Component {...pageProps} />
      </div>
      <Footer />
    </Main>
  )
}

export default App
