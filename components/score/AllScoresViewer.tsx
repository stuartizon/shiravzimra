import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'
import { Keyboard, Virtual } from 'swiper/modules'
import SwiperWithControls from '../swiperWithControls/SwiperWithControls'
import { useResizeObserver } from 'usehooks-ts'
import { useRouter } from 'next/router'
import styles from './pdf-annotations.module.css'
import DownloadPdf from '../download-pdf/DownloadPdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import 'swiper/css'

// Use the legacy worker build hosted on a CDN to avoid bundling issues
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

type PiecePageEntry = { id: string; page: number }

const AllScoresViewer = ({
  file,
  initialPage,
  initialChapterId
}: {
  file: string
  initialPage?: number
  initialChapterId?: string
}) => {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number>(0)
  const [piecePageMap, setPiecePageMap] = useState<PiecePageEntry[] | null>(null)
  const swiperRef = useRef<SwiperClass | null>(null)
  const suppressChapterApplyRef = useRef(false)
  const pages = useMemo(() => Array.from({ length: numPages }, (_el, idx) => idx + 1), [numPages])
  const onItemClick = ({
    pageNumber,
    pageIndex
  }: {
    pageNumber?: number
    pageIndex?: number
  }) => {
    const instance = swiperRef.current
    if (!instance) return
    const target =
      typeof pageNumber === 'number'
        ? pageNumber - 1
        : typeof pageIndex === 'number'
          ? pageIndex
          : null
    if (target == null) return
    instance.slideTo(target)
  }

  useEffect(() => {
    const instance = swiperRef.current
    if (!instance) return
    instance.virtual?.update(true)
    instance.updateSlides()
    instance.updateProgress()
  }, [numPages])

  // Navigate to an initial deep-linked page once the PDF and swiper are ready
  useEffect(() => {
    const instance = swiperRef.current
    if (!instance || !numPages) return
    if (!initialPage || initialPage < 1) return
    const target = Math.min(initialPage - 1, numPages - 1)
    instance.slideTo(target, 0)
  }, [initialPage, numPages])

  // If the route is the root path, ensure we jump back to the first page
  useEffect(() => {
    const instance = swiperRef.current
    if (!instance || !numPages) return
    const path = router.asPath.split('?')[0]
    if (path === '/') {
      instance.slideTo(0, 0)
    }
  }, [router.asPath, numPages])

  // Navigate to a chapter id once the map is loaded
  useEffect(() => {
    if (piecePageMap) return
    let cancelled = false
    const loadMap = async () => {
      try {
        const res = await fetch('/dist/piece-page-map.json')
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data)) return
        data.sort((a, b) => a.page - b.page)
        if (!cancelled) {
          setPiecePageMap(data)
        }
      } catch (_err) {
        // ignore fetch errors; navigation will simply be skipped
      }
    }
    loadMap()
    return () => {
      cancelled = true
    }
  }, [piecePageMap])

  useEffect(() => {
    if (!initialChapterId || !piecePageMap || !numPages) return
    const exists = piecePageMap.some((p) => p.id === initialChapterId)
    if (!exists) {
      router.replace('/404')
      return
    }
    if (suppressChapterApplyRef.current) {
      suppressChapterApplyRef.current = false
      return
    }
    const entry = piecePageMap.find((p) => p.id === initialChapterId)
    if (!entry) return
    const instance = swiperRef.current
    if (!instance) return
    const target = Math.min(entry.page - 1, numPages - 1)
    instance.slideTo(target, 0)
  }, [initialChapterId, numPages, piecePageMap])

  return (
    <div className={`py-2 ${styles.annotationOverrides}`}>
      <Document
        file={file}
        externalLinkTarget='_blank'
        externalLinkRel='noopener noreferrer'
        loading={
          <div className='bg-white page m-auto flex flex-col justify-center text-center shadow-xl shadow-black'>
            Loading...
          </div>
        }
        error={
          <div className='text-center py-10'>Unable to load PDF.</div>
        }
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onItemClick={onItemClick}
      >
        <Pages
          pages={pages}
          onSwiper={(s) => {
            swiperRef.current = s
          }}
          onSlideChange={(instance) => {
            const currentPage = instance.activeIndex + 1
            if (!piecePageMap || !router.isReady) return
            const chapterEntry = piecePageMap.reduce<PiecePageEntry | null>((acc, curr) => {
              if (curr.page <= currentPage) return curr
              return acc
            }, null)
            const nextId = chapterEntry?.id
            const targetPath =
              currentPage === 1
                ? '/'
                : nextId
                  ? `/${encodeURIComponent(nextId)}`
                  : null
            if (!targetPath) return
            const currentPath = router.asPath.split('?')[0]
            if (currentPath !== targetPath) {
              suppressChapterApplyRef.current = true
              router.push(targetPath, undefined, { shallow: true, scroll: false })
            }
          }}
        />
      </Document>
      <DownloadPdf href={file} />
    </div >
  )
}

const Pages = ({
  pages,
  onSwiper,
  onSlideChange
}: {
  pages: number[]
  onSwiper: (instance: SwiperClass) => void
  onSlideChange?: (instance: SwiperClass) => void
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { width = 0 } = useResizeObserver({ ref: containerRef })

  return (
    <SwiperWithControls
      ref={containerRef}
      modules={[Virtual, Keyboard]}
      virtual={{ enabled: true, addSlidesBefore: 2, addSlidesAfter: 2 }}
      keyboard={{ enabled: true, onlyInViewport: true }}
      slidesPerView={1}
      onSwiper={onSwiper}
      onSlideChange={onSlideChange}
    >
      {pages.map((pageNumber) => (
        <SwiperSlide key={`page_${pageNumber}`} virtualIndex={pageNumber - 1}>
          <PageWithLoader pageNumber={pageNumber} width={width} />
        </SwiperSlide>
      ))}
    </SwiperWithControls>
  )
}

const PageWithLoader = ({ pageNumber, width }: { pageNumber: number; width: number }) => {
  const [rendered, setRendered] = useState(false)
  const hasWidth = width > 0

  const placeholder = (
    <div
      className='bg-white page m-auto flex flex-col justify-center text-center'
    >
      Loading...
    </div>
  )

  return (
    <div className='relative'>
      {(!rendered || !hasWidth) && placeholder}
      {hasWidth && (
        <Page
          pageNumber={pageNumber}
          width={width}
          loading={placeholder}
          onRenderSuccess={() => setRendered(true)}
        />
      )}
    </div>
  )
}

export default AllScoresViewer
