import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Main from '../components/main/Main'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import Head from 'next/head'
import { useState } from 'react'

const App = ({ Component, pageProps }: AppProps) => {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <Main>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </Head>
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
