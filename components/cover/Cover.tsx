import { FC } from 'react'
import styles from './Cover.module.css'

export const Cover: FC = () => {
  return (
    <div className={styles.cover}>
      <h1 className='text-5xl font-bold md:mb-6 mb-2 font-serif'>Shira v&apos;Zimra</h1>
      <div className='text-4xl font-bold md:mb-10 mb-6 font-serif'>שירה וזמרה</div>
      <div className='text-xl text-center mb-4 font-serif'>
        A book of Jewish music for the<br/>
        synagogue and the home,<br/>
        arranged for male voice choir by
      </div>
      <div className='text-2xl mb-14 font-serif'>STUART IZON</div>
      <div className='font-serif md:invisible'>Swipe to get started</div>
      <img src="/images/swipe.svg" className={styles.swipe} width={64}/>
    </div>
  )
}
