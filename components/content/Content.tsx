import React, { FC } from 'react'
import { PropsWithChildren } from 'react'
import styles from './Contents.module.css'

const Content: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.content}>{children}</div>
}

export default Content
