import React, { FC } from 'react'
import { Section } from '../../data/types'

export const Entry: FC<EntryProps> = ({ id, name, author }) => (
  <li>
    <a href={`/${id}`} className='flex gap-1'>
      <span className='flex-shrink-0'>
        {id} {name}
      </span>

      <span className='flex-grow overflow-hidden '>{'.'.repeat(500)}</span>
      <span className='flex-shrink-0'>{author}</span>
    </a>
  </li>
)

export const ContentsSection: FC<ContentsSectionProps> = ({ section }) => {
  return (
    <div className='p-16' style={{ minHeight: 1018 }}>
      <h1 className='text-xl font-bold my-2'>{section.name}</h1>
      <ul className='mx-4'>
        {section.pieces.map(piece => (
          <Entry {...piece} key={piece.id} />
        ))}
      </ul>
    </div>
  )
}

interface EntryProps {
  id: string
  name: string
  author: string
}

interface ContentsSectionProps {
  section: Section
}
