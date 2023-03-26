import { FC } from 'react'
import { allGroups } from '../../data'

const Nav: FC = () => {
  return (
    <nav className='w-screen p-5 top-0 font-semibold overflow-hidden'>
      <div className='container mx-auto'>
        <ul
          className='list-none flex flex-row'
          style={{ fontFamily: 'Noto Sans' }}
        >
          <NavItem
            name="Shira v'Zimra"
            href='/#'
            className='flex-grow text-3xl'
          />

          {allGroups.map(group => (
            <NavItem
              name={group.name}
              key={group.id}
              href={`/#${group.sections[0]?.id || ''}`}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
}

const NavItem: FC<NavItemProps> = ({ name, href, className }) => (
  <li className={`inline mx-2 mt-auto ${className}`}>
    <a href={href} className='text-white transition duration-100'>
      {name}
    </a>
  </li>
)

export default Nav

interface NavItemProps {
  name: string
  href: string
  className?: string
}
