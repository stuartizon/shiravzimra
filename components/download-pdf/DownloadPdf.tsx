import Image from 'next/image'
import bookArt from './book.png'
import downloadIcon from './download.svg'

const DownloadPdf = ({ href }: { href: string }) => {
  return (
    <div className='flex items-center justify-center gap-4 mt-6'>
      <Image src={bookArt} alt='Book and quill illustration' width={190} height={135} />
      <a
        href={href}
        download
        className='font-semibold text-lg no-underline text-white inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/30 shadow-sm shadow-black/20 transition hover:bg-white/15 hover:ring-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
      >
        <span>Download the complete book as a PDF</span>
        <Image src={downloadIcon} alt='' width={32} height={32} />
      </a>
    </div>
  )
}

export default DownloadPdf
