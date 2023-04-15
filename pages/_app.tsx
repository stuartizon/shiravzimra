import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import Content from '../components/content/Content'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Content>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </Content>
  )
}

export default App
