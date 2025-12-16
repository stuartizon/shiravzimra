import React, { useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'
import { Virtual } from 'swiper/modules'
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
  const [swiper, setSwiper] = useState<SwiperClass>()

  const pages = useMemo(() => Array.from({ length: numPages }, (_el, idx) => idx + 1), [numPages])

  return (
    <div className='py-10'>
      <Document
        file={file}
        loading={<div className='text-center py-10'>Loading PDF…</div>}
        error={<div className='text-center py-10'>Unable to load PDF.</div>}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onItemClick={({ pageNumber }) => {
          console.log('Clicked page number:', pageNumber);
          if (!swiper || !pageNumber) return
          swiper.slideTo(pageNumber - 1)
        }}
      >
        <Pages pages={pages} onSwiper={setSwiper} />
      </Document>
    </div>
  )
}

const Pages = ({
  pages,
  onSwiper
}: {
  pages: number[]
  onSwiper: (instance: SwiperClass) => void
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { width = 0 } = useResizeObserver({ ref: containerRef })

  return (
    <SwiperWithControls
      ref={containerRef}
      modules={[Virtual]}
      virtual
      slidesPerView={1}
      onSwiper={onSwiper}
    >
      {pages.map((pageNumber) => (
        <SwiperSlide key={`page_${pageNumber}`} virtualIndex={pageNumber - 1}>
          <Page pageNumber={pageNumber} width={width} />
        </SwiperSlide>
      ))}
    </SwiperWithControls>
  )
}

export default AllScoresViewer
