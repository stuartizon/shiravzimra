import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className='main'>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </Head>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}

export default App
