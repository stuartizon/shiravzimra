import spotify from './spotify.svg'
import styles from './Icon.module.css'

export const Spotify = ({ width }: { width: number }) => {
  return <img src={spotify.src} className={styles.icon} width={width} />
}
