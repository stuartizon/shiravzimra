import { AnchorHTMLAttributes } from 'react'
import { Amazon, Apple, Spotify, YouTube } from '../icon/Icon'

const Footer = () => {
  return (
    <div className='py-10 flex justify-center space-x-5 bg-stone-900'>
      {/* Facebook Email */}
      <FooterLink href='https://www.youtube.com/@stuartizon' title='YouTube'>
        <YouTube width={40} />
      </FooterLink>
      <FooterLink href='https://open.spotify.com/artist/5hR3LHEtnd6eJmdSWdiegA' title="Spotify">
        <Spotify width={40} />
      </FooterLink>
      <FooterLink href='https://music.apple.com/us/artist/stuart-izon/1685923236' title="Apple Music">
        <Apple width={40} />
      </FooterLink>
      <FooterLink href='https://music.amazon.com/artists/B0BWKB5VZR/stuart-izon' title="Amazon Music">
        <Amazon width={40} />
      </FooterLink>
    </div>
  )
}

const FooterLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) =>
  <a {...props} target='_blank' rel="noreferrer"/>

export default Footer
