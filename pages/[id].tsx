import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import Score from '../components/score/Score'
import { useRouter } from 'next/router'
import { allPieces, allPiecesMap } from '../data'
import Head from 'next/head'

const Home: NextPage<Props> = ({
  name,
  description,
  spotifyUrl,
  youtubeUrl,
  appleUrl,
  amazonUrl
}) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
    <Head>
      <title>{name}</title>
    </Head>
      <Score
        id={id as string}
        file={`/scores/${id}.pdf`}
        name={name}
        spotifyUrl={spotifyUrl}
        youtubeUrl={youtubeUrl}
        appleUrl={appleUrl}
        amazonUrl={amazonUrl}
      />
      <div className='text-white w-page max-w-full px-10 my-8 mx-auto whitespace-pre-line'>
        {description}
      </div>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps<Props> = context => {
  const { id } = context.params!
  const thisPiece = allPiecesMap.get(id as string)

  return {
    props: {
      name: thisPiece?.name ?? null,
      description: thisPiece?.description ?? null,
      spotifyUrl: thisPiece?.spotifyUrl ?? null,
      youtubeUrl: thisPiece?.youtubeUrl ?? null,
      appleUrl: thisPiece?.appleUrl ?? null,
      amazonUrl: thisPiece?.amazonUrl ?? null
    }
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = allPieces.map(piece => ({
    params: {
      id: piece.id
    }
  }))

  return {
    paths,
    fallback: false
  }
}

interface Props {
  name: string | null
  description: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
  appleUrl: string | null
  amazonUrl: string | null
}
