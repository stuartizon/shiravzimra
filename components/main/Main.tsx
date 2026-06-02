import { FC, PropsWithChildren } from 'react'
import styles from './Main.module.css'
import background from './background.jpg'

const Main: FC<PropsWithChildren<{ scrollLocked?: boolean; fontVariables?: string }>> = ({ children, scrollLocked, fontVariables }) => {
  return (
    <div
      className={`${styles.main} ${scrollLocked ? styles.scrollLocked : ''} ${fontVariables ?? ''}`}
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {children}
    </div>
  )
}

export default Main
