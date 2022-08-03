import type { NextPage } from 'next'
import Score from '../components/score/Score'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className="bg-gray-50">
      KOL BARZEL
      &nbsp;
      <div className="md:container mx-auto ">
        <Score file={`/${id}.pdf`} />
      </div>
      &nbsp;
    </div>
  )
}

export default Home
