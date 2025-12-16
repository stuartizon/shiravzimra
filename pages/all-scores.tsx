import dynamic from 'next/dynamic'
import Head from 'next/head'

const AllScoresViewer = dynamic(() => import('../components/score/AllScoresViewer'), {
  ssr: false
})

const AllScoresPage = () => {
  return (
    <>
      <Head>
        <title>All Scores</title>
      </Head>
      <AllScoresViewer file='/dist/all-scores.pdf' />
    </>
  )
}

export default AllScoresPage
