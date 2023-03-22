import type { NextPage } from 'next'
import Image from 'next/image'

const PageNotFound: NextPage = () => {
  return (
    <div className='flex flex-col flex-1 items-center mt-20 text-white'>
      <h1 className='text-8xl font-bold mb-4'>404</h1>
      <h2 className='text-2xl font-bold text-center mb-10'>
        Oops! You weren't supposed to see this.
      </h2>
      <div className=''>
        <Image
          src='/404.png'
          width={656}
          height={183}
          className='mix-blend-lighten'
        />
      </div>
      <p>We can't find the score you're looking for.</p>
    </div>
  )
}

export default PageNotFound
