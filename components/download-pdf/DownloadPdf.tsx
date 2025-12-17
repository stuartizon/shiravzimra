import Image from 'next/image'
import bookArt from './book.png'
import downloadIcon from './download.svg'

const DownloadPdf = ({ href }: { href: string }) => {
  return (
    <div className='flex items-center justify-center gap-4 mt-6'>
      <Image src={bookArt} alt='Book and quill illustration' width={252} height={180} />
      <a
        href={href}
        download
        className='font-semibold text-lg no-underline text-white flex items-center gap-1.5'
      >
        <span>Download the complete book as a PDF</span>
        <Image src={downloadIcon} alt='' width={32} height={32} />
      </a>
    </div>
  )
}

export default DownloadPdf
