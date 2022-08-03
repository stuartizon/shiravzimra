import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import soundOfSilence from "./404.png";

const PageNotFound: NextPage = () => {
    return (
        <div className='flex flex-col items-center m-8'>
            <h1 className='text-8xl font-bold text-blue-400'>404</h1>
            <h2 className='text-2xl font-bold text-center'>Oops! You weren't supposed to see this.</h2>
            <div className='flex-grasdow-0'>
                <Image src={soundOfSilence} width={656} height={183} />
            </div>
            <p>We can't find the score you're looking for.</p>
            <p>Click here to go back to the home page.</p>

            <Link href="/">
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold my-2 py-2 px-4 rounded">
                    Home
                </button>
            </Link>
        </div>
    )
}

export default PageNotFound