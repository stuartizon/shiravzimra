import type { NextPage } from 'next'
import { Contents } from '../components/contents/Contents'
import Link from 'next/link'
import Hero from '../components/hero/Hero'

const Home: NextPage = () => {
  return (
    <>
      <Hero>
        <h1 className='text-8xl font-bold my-4'>קול ברזל</h1>
        <h2 className='text-3xl my-4 leading-relaxed'>A Handbook of Synagogue Music<br />For Male Voice Choir</h2>
        <h3 className='text-xl my-4'>Arranged and Edited by<br />STUART IZON</h3>
        <ul className='my-8 inline-block text-left'>
          <li>➤ <a href="#shabbatevening">Shabbat Evening</a></li>
          <li>➤ Shabbat Day</li>
          <li>➤ Hallel</li>
        </ul>
      </Hero>
      {/* <div className="shadow-lg p-4 mx-auto text-center"> */}
        {/* <h1 className='text-8xl text-blue-400 font-bold my-4'>קול ברזל</h1> */}
{/*         

        <ul className='my-8'>
          <li>שבת – Sabbath</li>
          <li>הלל – Hallel</li>
          <li>רגלים – Festivals</li>
          <li>נוראים – Days of Awe</li>
          <li>זמירות – Songs</li>
          <li>סליחות – Repentance</li>
        </ul> */}
        <div className='w-1/2 mx-auto'>
          <Contents />
        </div>
      {/* </div> */}
    </>
  )
}

export default Home