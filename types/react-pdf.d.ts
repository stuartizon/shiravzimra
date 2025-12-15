declare module 'react-pdf' {
  import * as React from 'react'

  export interface PdfJsStatic {
    GlobalWorkerOptions: { workerSrc?: string }
  }

  export const pdfjs: PdfJsStatic

  export interface DocumentProps {
    file?: string | File | { url: string }
    onLoadSuccess?: (info: { numPages: number }) => void
    onItemClick?: (item: { pageNumber?: number }) => void
    loading?: React.ReactNode
    error?: React.ReactNode
    children?: React.ReactNode
  }

  export const Document: React.ComponentType<DocumentProps>

  export interface PageProps {
    pageNumber: number
    width?: number
    renderAnnotationLayer?: boolean
    renderTextLayer?: boolean
    loading?: React.ReactNode
  }

  export const Page: React.ComponentType<PageProps>
}
