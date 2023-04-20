import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import Content from '../components/content/Content'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </Head>
      <Content>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </Content>
    </>
  )
}

export default App
