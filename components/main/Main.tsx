import { FC, PropsWithChildren } from 'react'
import styles from './Main.module.css'
import background from './background.jpg'

const Main: FC<PropsWithChildren<{ scrollLocked?: boolean }>> = ({ children, scrollLocked }) => {
  return (
    <div
      className={`${styles.main} ${scrollLocked ? styles.scrollLocked : ''}`}
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {children}
    </div>
  )
}

export default Main
