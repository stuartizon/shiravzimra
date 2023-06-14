import amazon from './amazon.svg'
import apple from './apple.svg'
import spotify from './spotify.svg'
import youtube from './youtube.svg'
import styles from './Icon.module.css'

export const Amazon = ({ width }: { width: number }) => {
  return <img src={amazon.src} className={styles.icon} width={width} />
}

export const Apple = ({ width }: { width: number }) => {
  return <img src={apple.src} className={styles.icon} width={width} />
}

export const Spotify = ({ width }: { width: number }) => {
  return <img src={spotify.src} className={styles.icon} width={width} />
}

export const YouTube = ({ width }: { width: number }) => {
  return <img src={youtube.src} className={styles.icon} width={width} />
}
