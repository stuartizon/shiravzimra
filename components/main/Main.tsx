import { FC, PropsWithChildren } from 'react'
import styles from './Main.module.css'
import background from './background.jpg'

const Main: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={styles.main}
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {children}
    </div>
  )
}

export default Main
