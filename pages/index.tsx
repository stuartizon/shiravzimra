import type { NextPage } from 'next'
import { Contents } from '../components/contents/Contents'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className="bg-gray-50 container mx-auto">
      Home page
      <Contents />
    </div>
  )
}

export default Home