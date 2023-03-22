import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import { useRouter } from 'next/router'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { SwiperSlide } from 'swiper/react'
import SwiperWithControls from '../swiperWithControls/SwiperWithControls'

import spotify from './spotify.svg'
import download from './download.svg'
import youtube from './youtube.svg'
import 'swiper/css'
import styles from './Score.module.css'

const Score = ({ id, file, name, author, spotifyUrl, youtubeUrl }: Props) => {
  const router = useRouter()
  //   const [ref, { width }] = useElementSize()

  const [numPages, setNumPages] = useState<number>(0)
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }
  const onLoadError = (error: Error) => {
    console.log('React PDF', error)
  }

  return (
    <div style={{ minHeight: 1018 }}>
      <div
        className='m-auto flex justify-start relative z-10 mb-2'
        style={{ width: 720 }}
      >
        <a
          href={file}
          download={`${id} ${name} ${author}`}
          title='Download PDF'
        >
          <img src={download.src} className={styles.button} width={40} />
        </a>
        {youtubeUrl && (
          <a href={youtubeUrl} target='_blank' title='YouTube' className='mr-2'>
            <img src={youtube.src} width={40} className={styles.button} />
          </a>
        )}
        {spotifyUrl && (
          <a href={spotifyUrl} target='_blank' title='Spotify' className='flex'>
            <img src={spotify.src} className={styles.button} width={30} />
          </a>
        )}
      </div>
      <Document
        file={{ url: file }}
        loading={
          <div
            className='bg-white m-auto flex flex-col justify-center text-center'
            style={{ width: 720, minHeight: 1018 }}
          >
            Loading...
          </div>
        }
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
      >
        <SwiperWithControls
          className='bg-white shadow-lg shadow-black m-auto'
          style={{ width: 720, minHeight: 1018 }}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <SwiperSlide key={'page_' + index}>
              <Page
                loading={
                  <div
                    className='flex justify-center items-center'
                    style={{ width: 720, minHeight: 1018 }}
                  >
                    Loading...
                  </div>
                }
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={720}
                className={``}
              />
            </SwiperSlide>
          ))}
        </SwiperWithControls>
      </Document>
    </div>
  )
}

interface Props {
  id: string
  file: string
  name: string | null
  author: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
}

export default Score
