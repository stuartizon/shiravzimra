import { Spotify } from '../icon/Spotify'
import { YouTube } from '../icon/YouTube'

const Footer = () => {
  return (
    <div className='py-10 flex justify-center space-x-5 bg-stone-900'>
      {/* Facebook Email */}
      <a
        href='https://open.spotify.com/artist/5hR3LHEtnd6eJmdSWdiegA'
        target='_blank'
        rel='noreferrer'
      >
        <Spotify width={40} />
      </a>
      <a
        href='https://www.youtube.com/@stuartizon'
        target='_blank'
        rel='noreferrer'
      >
        <YouTube width={40} />
      </a>
    </div>
  )
}

export default Footer
