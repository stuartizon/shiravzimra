import React, { AnchorHTMLAttributes, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import styles from './pdf-annotations.module.css'
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`
import { SwiperSlide } from 'swiper/react'
import SwiperWithControls from '../swiperWithControls/SwiperWithControls'
import { useResizeObserver } from 'usehooks-ts'
import 'swiper/css'
import { Amazon, Apple, Download, Spotify, YouTube } from '../icon/Icon'

const Score = ({ id, file, name, spotifyUrl, youtubeUrl, appleUrl, amazonUrl }: Props) => {
  const [numPages, setNumPages] = useState<number>(0)
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return (
    <div
    // style={{ minHeight: 1018 }}
    >
      <div className='m-auto flex justify-start relative z-10 mb-2 w-page max-w-full'>
        {numPages > 0 && (
          <>
            <a href={file} download={`${id} ${name}`} title='Download PDF'>
              <Download width={32}/>
            </a>
            {youtubeUrl && (
              <Link href={youtubeUrl} title='YouTube'><YouTube width={32}/></Link>
            )}
            {spotifyUrl && (
              <Link href={spotifyUrl} title='Spotify'><Spotify width={32}/></Link>
            )}
            {appleUrl && (
              <Link href={appleUrl} title='Apple Music'><Apple width={32}/></Link>
            )}
            {amazonUrl && (
              <Link href={amazonUrl} title='Amazon Music'><Amazon width={32}/></Link>
            )}
          </>
        )}
      </div>
      <div className={styles.annotationOverrides}>
      <Document
        file={{ url: file }}
        externalLinkTarget='_blank'
        externalLinkRel='noopener noreferrer'
        loading={
          <div
            className='bg-white page m-auto flex flex-col justify-center text-center shadow-xl shadow-black'
          >
            Loading...
          </div>
        }
        error={
          <div
            className='bg-white page m-auto flex flex-col justify-center text-center shadow-xl shadow-black'
          >
            This score cannot be loaded
          </div>
        }
        onLoadSuccess={onLoadSuccess}
      >
        <Pages numPages={numPages} />
      </Document>
      </div>
    </div>
  )
}

const Link = (props: AnchorHTMLAttributes<HTMLAnchorElement>) =>
  <a {...props} target='_blank' rel="noreferrer"/>

const Pages = ({ numPages }: { numPages: number }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { width = 0 } = useResizeObserver({ ref: containerRef })

  return (
    <SwiperWithControls
      // style={{ minHeight: 1018 }}
      ref={containerRef}
    >
      {Array.from(new Array(numPages), (_el, index) => (
        <SwiperSlide key={'page_' + index}>
          <Page
            width={width}
            loading={
              <div
                className='flex justify-center items-center'
                // style={{ minHeight: 1018 }}
              >
                Loading...
              </div>
            }
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            // width={width}
            // className='w-1'
          />
        </SwiperSlide>
      ))}
    </SwiperWithControls>
  )
}

interface Props {
  id: string
  file: string
  name: string | null
  amazonUrl: string | null
  appleUrl: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
}

export default Score
