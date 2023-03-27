import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'

import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { SwiperSlide } from 'swiper/react'
import SwiperWithControls from '../swiperWithControls/SwiperWithControls'

import spotify from './spotify.svg'
import download from './download.svg'
import youtube from './youtube.svg'
import styles from './Score.module.css'
import { useElementSize } from 'usehooks-ts'
import 'swiper/css'

const Score = ({ id, file, name, spotifyUrl, youtubeUrl }: Props) => {
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
              <img src={download.src} width={40} className={styles.button} />
            </a>
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target='_blank'
                title='YouTube'
                className='mr-2'
                rel='noreferrer'
              >
                <img src={youtube.src} width={40} className={styles.button} />
              </a>
            )}
            {spotifyUrl && (
              <a
                href={spotifyUrl}
                target='_blank'
                title='Spotify'
                className='flex'
                rel='noreferrer'
              >
                <img src={spotify.src} className={styles.button} width={30} />
              </a>
            )}
          </>
        )}
      </div>
      <Document
        file={{ url: file }}
        loading={
          <div
            className='bg-white w-page m-auto flex flex-col justify-center text-center shadow-xl shadow-black'
            style={{ minHeight: 1018 }}
          >
            Loading...
          </div>
        }
        error={
          <div
            className='bg-white w-page m-auto flex flex-col justify-center text-center shadow-xl shadow-black'
            style={{ minHeight: 1018 }}
          >
            This score cannot be loaded
          </div>
        }
        onLoadSuccess={onLoadSuccess}
      >
        <Pages numPages={numPages} />
      </Document>
    </div>
  )
}

const Pages = ({ numPages }: { numPages: number }) => {
  const [ref, { width }] = useElementSize()

  return (
    <SwiperWithControls
      // style={{ minHeight: 1018 }}
      ref={ref}
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
  spotifyUrl: string | null
  youtubeUrl: string | null
}

export default Score
