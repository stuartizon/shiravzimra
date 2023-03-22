import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import Score from '../components/score/Score'
import { useRouter } from 'next/router'
import { allPieces, allPiecesMap } from '../data'

const Home: NextPage<Props> = ({
  name,
  description,
  author,
  spotifyUrl,
  youtubeUrl
}) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      {/* <Nav /> */}
      <Score
        id={id as string}
        file={`/${id}.pdf`}
        name={name}
        author={author}
        spotifyUrl={spotifyUrl}
        youtubeUrl={youtubeUrl}
      />
      {/* &nbsp; */}
      <div className='text-white my-8 mx-auto whitespace-pre-line' style={{ width: 640 }}>
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
      author: thisPiece?.author ?? null,
      spotifyUrl: thisPiece?.spotifyUrl ?? null,
      youtubeUrl: thisPiece?.youtubeUrl ?? null
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
  author: string | null
  spotifyUrl: string | null
  youtubeUrl: string | null
}
