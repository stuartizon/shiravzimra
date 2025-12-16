import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

const AllScoresViewer = dynamic(() => import('../../components/score/AllScoresViewer'), {
  ssr: false
})

const AllScoresPage = () => {
  const router = useRouter()

  const initialPage = useMemo(() => {
    if (!router.isReady) return undefined
    const value = Array.isArray(router.query.page) ? router.query.page[0] : router.query.page
    const parsed = value ? Number(value) : NaN
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }, [router.isReady, router.query.page])

  const initialChapterId = useMemo(() => {
    if (!router.isReady) return undefined
    const value = Array.isArray(router.query.chapter)
      ? router.query.chapter[0]
      : router.query.chapter
    return typeof value === 'string' ? value : undefined
  }, [router.isReady, router.query.chapter])

  return (
    <>
      <Head>
        <title>All Scores</title>
      </Head>
      <AllScoresViewer
        file='/dist/all-scores.pdf'
        initialPage={initialPage}
        initialChapterId={initialChapterId}
      />
    </>
  )
}

export default AllScoresPage
