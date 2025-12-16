import React, { useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { SwiperSlide } from 'swiper/react'
import SwiperWithControls from '../swiperWithControls/SwiperWithControls'
import { useResizeObserver } from 'usehooks-ts'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import 'swiper/css'

// Use the legacy worker build hosted on a CDN to avoid bundling issues
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

const AllScoresViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number>(0)

  return (
    <div className='py-10'>
      <Document
        file={file}
        loading={<div className='text-center py-10'>Loading PDF…</div>}
        error={<div className='text-center py-10'>Unable to load PDF.</div>}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Pages numPages={numPages} />
      </Document>
    </div>
  )
}

const Pages = ({ numPages }: { numPages: number }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { width = 0 } = useResizeObserver({ ref: containerRef })

  return (
    <SwiperWithControls ref={containerRef}>
      {Array.from({ length: numPages }, (_el, idx) => {
        const pageNumber = idx + 1
        return (
          <SwiperSlide key={`page_${pageNumber}`}>
            <Page pageNumber={pageNumber} width={width} />
          </SwiperSlide>
        )
      })}
    </SwiperWithControls>);
}

export default AllScoresViewer
