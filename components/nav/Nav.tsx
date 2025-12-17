import { CSSProperties, FC, Fragment } from 'react'
import Link from 'next/link'
import { allGroups } from '../../data'
import styles from './Nav.module.css';
import { Group } from '../../data/types';

const Nav: FC<NavProps> = ({ showMobileMenu, onClickMenu }) => {
  return (
    <nav className='w-full top-0 font-semibold h-16 relative'>
      <div className='container mx-auto h-full'>
        <ul className='list-none flex flex-row h-full'>
          <NavItem
            name="Shira v'Zimra"
            href='/'
            className='flex-grow text-3xl text-center md:text-left font-serif'
          />

          <li className={styles.desktopMenuLink}>
            <Link href="/preface" className='text-white align-sub'>Preface</Link>
          </li>

          {allGroups.map(group => (
            <DesktopMenuLink key={group.id} {...group} />
          ))}
        </ul>
      </div>
      <div className={`${styles.burger} ${showMobileMenu ? styles.enabled : styles.disabled}`} onClick={onClickMenu}>
        <img src='/images/burger.svg' className='invert' width={42} />
      </div>
      {showMobileMenu && (
        <div className={styles.menu}>
          <ul>
            <li className='mt-3'>
              <Link className='text-white' href='/preface' onClick={onClickMenu}>
                Preface
              </Link>
            </li>
            {allGroups.map(group => (
              <Fragment key={group.id}>
                <li className='mt-3'>
                  <Link className='text-white' href={`/${group.sections[0].id}`} onClick={onClickMenu}>
                    {group.name}
                  </Link>
                </li>
                <ul className='ml-4'>
                  {group.sections.map(section => (
                    <li key={section.id}>
                      <Link className='text-white' href={`/${section.id}`} onClick={onClickMenu}>
                        {section.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

const DesktopMenuLink: FC<Group> = ({ name, sections }) => (
  <li className={styles.desktopMenuLink}>
    <Link href={`/${sections[0]?.id || ''}`} className='text-white align-sub'>{name}</Link>
    <div className={styles.desktopMenuDropdown}>
      <ul>
        {sections.map(section => (
          <li key={section.id}>
            <Link className='text-white text-base' href={`/${section.id}`}>
              {section.shortName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </li>
)

const NavItem: FC<NavItemProps> = ({ name, href, className, style }) => (
  <li className={`mx-2 my-auto flex-shrink-0 ${className}`}>
    <Link href={href} className='text-white transition duration-100 align-sub' style={style}>
      {name}
    </Link>
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
