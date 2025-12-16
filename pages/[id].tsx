import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { allPieces, allPiecesMap } from '../data'
import Head from 'next/head'

const Score = dynamic(() => import('../components/score/Score'), { ssr: false })

const Home: NextPage<Props> = ({
  id,
  name,
  description,
  spotifyUrl,
  youtubeUrl,
  appleUrl,
  amazonUrl
}) => {
  return (
    <>
    <Head>
      <title>{name}</title>
    </Head>
      <Score
        id={id}
        file={`/scores/${id}.pdf`}
        name={name}
        spotifyUrl={spotifyUrl}
        youtubeUrl={youtubeUrl}
        appleUrl={appleUrl}
        amazonUrl={amazonUrl}
      />
      <div className='my-8'/>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps<Props> = context => {
  const { id } = context.params!
  const thisPiece = allPiecesMap.get(id as string)

  return {
    props: {
      id: id as string,
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
  id: string
  name: string | null
  description: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
  appleUrl: string | null
  amazonUrl: string | null
}
