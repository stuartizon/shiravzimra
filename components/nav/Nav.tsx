import { CSSProperties, FC } from 'react'
import { allGroups } from '../../data'
import styles from './Nav.module.css';
import { Group } from '../../data/types';

const Nav: FC<NavProps> = ({showMobileMenu, onClickMenu}) => {
  return (
    <nav className='w-screen top-0 font-semibold h-16 relative'>
      <div className='container mx-auto h-full'>
        <ul className='list-none flex flex-row h-full'>
          <NavItem
            name="Shira v'Zimra"
            href='/#'
            className='flex-grow text-3xl text-center md:text-left font-serif'
          />

          {allGroups.map(group => (
            <DesktopMenuLink key={group.id} {...group} />
          ))}
        </ul>
      </div>
      <div className={`${styles.burger} ${showMobileMenu ? styles.enabled : styles.disabled}`} onClick={onClickMenu}>
        <img src='/images/burger.svg' className='invert' width={42} />
      </div>
      <div className={`${styles.menu} ${showMobileMenu ? 'visible' : 'invisible'}`}>
        <ul>
          {allGroups.map(group => (
            <>
            <li className='mt-3'>
              <a className='text-white' href={`/#${group.sections[0].id}`} onClick={onClickMenu}>{group.name}</a>
            </li>
            <ul className='ml-4'>
              {group.sections.map(section => (
                <li key={section.id}><a className='text-white' href={`/#${section.id}`} onClick={onClickMenu}>{section.name}</a></li>
              ))}
            </ul>
            </>
          ))}
        </ul>
      </div>
    </nav>
  )
}

const DesktopMenuLink: FC<Group> = ({name, sections}) => (
    <li className={styles.desktopMenuLink}>
      <a href={`/#${sections[0]?.id || ''}`} className='text-white align-sub'>{name}</a>
      <div className={styles.desktopMenuDropdown}>
        <ul>
          {sections.map(section => (
            <li key={section.id}><a className='text-white text-base' href={`/#${section.id}`}>{section.shortName}</a></li>
          ))}
        </ul>
      </div>
    </li>
)

const NavItem: FC<NavItemProps> = ({ name, href, className, style }) => (
  <li className={`mx-2 my-auto flex-shrink-0 ${className}`}>
    <a href={href} className='text-white transition duration-100 align-sub' style={style}>
      {name}
    </a>
  </li>
)

export default Nav

interface NavProps {
  showMobileMenu: boolean
  onClickMenu: () => void
}

interface NavItemProps {
  name: string
  href: string
  className?: string
  style?: CSSProperties
}
