import spotify from './youtube2.svg'
import styles from './Icon.module.css'

export const YouTube = ({ width }: { width: number }) => {
  return <img src={spotify.src} className={styles.icon} width={width} />
}
