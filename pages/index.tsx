import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className="bg-gray-50">
      Home page
      <div>
        <Link href="/206a"><a>206a L'cha Adonai</a></Link>...... Louis Lewandowski
      </div>
    </div>
  )
}

export default Home