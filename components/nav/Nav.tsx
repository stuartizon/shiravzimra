import { CSSProperties, FC } from 'react'
import { allGroups } from '../../data'

const Nav: FC = () => {
  return (
    <nav className='w-screen p-5 top-0 font-semibold overflow-hidden'>
      <div className='container mx-auto'>
        <ul className='list-none flex flex-row'>
          <NavItem
            name="Shira v'Zimra"
            href='/#'
            className='flex-grow text-3xl text-center md:text-left'
          />

          {allGroups.map(group => (
            <NavItem
              name={group.name}
              key={group.id}
              href={`/#${group.sections[0]?.id || ''}`}
              className='hidden md:inline'
              style={{ fontFamily: 'Noto Sans' }}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
}

const NavItem: FC<NavItemProps> = ({ name, href, className, style }) => (
  <li className={`mx-2 mt-auto flex-shrink-0 ${className}`}>
    <a href={href} className='text-white transition duration-100' style={style}>
      {name}
    </a>
  </li>
)

export default Nav

interface NavItemProps {
  name: string
  href: string
  className?: string
  style?: CSSProperties
}
