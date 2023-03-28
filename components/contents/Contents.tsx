import React, { FC } from 'react'
import { Section } from '../../data/types'

const Author = ({ author }: { author: string }) => {
  var lastIndex = author.lastIndexOf(' ')

  return (
    <span className='flex-shrink-0'>
      <span className='hidden md:inline'>{author.substring(0, lastIndex)}</span>
      <span>{author.substring(lastIndex)}</span>
    </span>
  )
}

export const Entry: FC<EntryProps> = ({ id, name, author }) => (
  <li>
    <a href={`/${id}`} className='flex gap-1'>
      <span className='flex-shrink-0'>
        <span className='inline'>{id}</span> {name}
      </span>

      <span className='flex-grow overflow-hidden '>{'.'.repeat(500)}</span>
      <Author author={author} />
    </a>
  </li>
)

export const ContentsSection: FC<ContentsSectionProps> = ({ section }) => {
  return (
    <div className='p-2 md:p-16' style={{ minHeight: 1018 }}>
      <h1 className='text-2xl font-bold my-2'>{section.name}</h1>
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
