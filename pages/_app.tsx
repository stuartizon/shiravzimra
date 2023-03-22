import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'

function App ({ Component, pageProps }: AppProps) {
  return (
    <div className='content'>
      <Nav/>
      <Component {...pageProps} />
      <Footer/>
    </div>
  )
}

export default App
