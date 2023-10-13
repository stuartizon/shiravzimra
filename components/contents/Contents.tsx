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
    <a href={`/${id}`} className='flex gap-1' tabIndex={-1}>
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
    <div className='font-serif mt-8 mx-6 md:mt-32 md:mx-24'>
      <h1 className='text-2xl text-center font-bold uppercase mb-3 md:mb-6'>{section.name}</h1>
      <ul className='font-sans normal-case text-left text-xs md:text-base'>
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
