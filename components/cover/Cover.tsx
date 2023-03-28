import { FC } from 'react'
import { allGroups } from '../../data'
import styles from './Cover.module.css'

const Cover: FC = () => {
  return (
    <div className={styles.cover}>
      <h1 className='text-5xl font-bold mt-36 mb-4 '>Shira v&apos;Zimra</h1>
      <div className='text-xl text-center mt-8'>
        A book of Jewish music for the synagogue and the home,
      </div>
      <div className='text-xl text-center mb-4'>
        Arranged for male voice choir by
      </div>

      {/* <h3 className='text-xl mt-4'>Arranged and Edited by</h3> */}
      <h3 className='text-xl mb-4'>STUART IZON</h3>
      <ul className='list-none' style={{ fontFamily: 'Noto Sans' }}>
        {allGroups.map(group => (
          <div className='my-4' key={group.id}>
            {group.sections.map(section => (
              <li className={styles.item} key={section.id}>
                <a href={`#${section.id}`} tabIndex={-1}>{section.name}</a>
              </li>
            ))}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Cover
