import * as React from 'react'
import {
  birkatHamazon,
  chanukah,
  festivalsMaariv,
  kolNidrei,
  rhMaariv
} from '../../data'
import { kabbalatShabbat } from '../../data/kabbalatShabbat'
import styles from './Cover.module.css'

const Cover: React.FC<{}> = () => {
  return (
    <div className={styles.cover}>
      <h1 className='text-5xl font-bold my-4 '>Shira v'Zimra</h1>
      {/* <h2 className='text-3xl my-4 leading-relaxed'>A Handbook of Synagogue Music<br />For Male Voice Choir</h2> */}

      <div className='text-xl text-center mt-8'>
        A book of Jewish music for the synagogue and the home,
      </div>
      <div className='text-xl text-center mb-4'>
        Arranged for male voice choir by
      </div>

      {/* <h3 className='text-xl mt-4'>Arranged and Edited by</h3> */}
      <h3 className='text-xl mb-4'>STUART IZON</h3>
      <ul className='my-8 inline-block text-left'>
        <li>
          <a href={`#${kabbalatShabbat.id}`}>Shabbat</a>
        </li>
        <li>
          <a href={`#${festivalsMaariv.id}`}>Festivals</a>
        </li>
        <li>
          <a href={`#${rhMaariv.id}`}>Rosh Hashana</a>
        </li>
        <li>
          <a href={`#${kolNidrei.id}`}>Yom Kippur</a>
        </li>
        <li>
          <a href={`#${chanukah.id}`}>Misc</a>
        </li>
        <li>
          <a href={`#${birkatHamazon.id}`}>Songs</a>
        </li>
      </ul>
    </div>
  )
}

// interface Props {
//     id: string;
//     children: React.ReactNode;
// }

export default Cover
