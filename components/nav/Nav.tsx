import * as React from 'react'
import {
  birkatHamazon,
  chanukah,
  festivalsMaariv,
  kolNidrei,
  rhMaariv
} from '../../data'
import { kabbalatShabbat } from '../../data/kabbalatShabbat'

export default () => {
  return (
    <nav className='w-screen p-5 top-0 font-semibold overflow-hidden'>
      <div className='container mx-auto'>
        <ul className='list-none flex flex-row'>
          <NavItem
            name="Shira v'Zimra"
            href='/#'
            className='flex-grow text-2xl'
          />
          <NavItem name='Shabbat' href={`/#${kabbalatShabbat.id}`} />
          <NavItem name='Festivals' href={`/#${festivalsMaariv.id}`} />
          <NavItem name='Rosh Hashana' href={`/#${rhMaariv.id}`} />
          <NavItem name='Yom Kippur' href={`/#${kolNidrei.id}`} />
          <NavItem name='Misc' href={`/#${chanukah.id}`} />
          <NavItem name='Songs' href={`/#${birkatHamazon.id}`} />
        </ul>
      </div>
    </nav>
  )
}

const NavItem = ({ name, href, className }: NavItemProps) => (
  <li className={`inline mx-2 mt-auto ${className}`}>
    <a href={href} className='text-white transition duration-100'>
      {name}
    </a>
  </li>
)

interface NavItemProps {
  name: string
  href: string
  className?: string
}
