import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Main from '../components/main/Main'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import Head from 'next/head'
import Script from 'next/script'
import { useState } from 'react'
import { notoSans, edwin } from '../lib/fonts'

const App = ({ Component, pageProps }: AppProps) => {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <Main scrollLocked={mobileMenu} fontVariables={`${notoSans.variable} ${edwin.variable}`}>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <meta property='og:title' content="Shira v'Zimra" />
        <meta
          property='og:description'
          content='A book of Jewish music for the synagogue and the home, arranged for male voice choir by Stuart Izon'
        />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='https://www.shiravzimra.com/opengraph.png' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:width' content='1024' />
        <meta property='og:image:height' content='1024' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content="Shira v'Zimra" />
        <meta
          name='twitter:description'
          content='A book of Jewish music for the synagogue and the home, arranged for male voice choir by Stuart Izon'
        />
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
