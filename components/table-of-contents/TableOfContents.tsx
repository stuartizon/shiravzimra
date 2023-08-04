import { FC } from 'react'
import { allGroups } from '../../data'

export const TableOfContents: FC = () => {
  return (
    <div className='font-serif mt-8 mx-8 md:mt-32 md:mx-24'>
      <h1 className='text-2xl text-center font-bold uppercase mb-3 md:mb-6'>
        Table of Contents
      </h1>

      {/* <ul className='font-sans normal-case text-left text-sm'>
        <Entry id='about' text='About' />
      </ul> */}

      {allGroups.map((group, index) => (
        <div key={group.id} className='uppercase text-center mt-2 md:mt-6 text-sm md:text-lg'>
          Part {index + 1}: {group.name} &ndash; {group.hebrewName}
          <ul className='font-sans normal-case text-left text-xs md:text-base'>
            {group.sections.map(section => (
              <Entry key={section.id} id={section.id} text={section.shortName} textRight={section.hebrewName} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// const Entry: FC<EntryProps> = ({ id, name }) => {
//   return (
//     <li key={id}>
//       <a href={`#${id}`} tabIndex={-1}>
//         {name}
//       </a>
//     </li>
//   )
// }

export const Entry: FC<EntryProps> = ({ id, text, textRight }) => (
  <li>
    <a href={`#${id}`} className='flex gap-1' tabIndex={-1}>
      <span className='flex-shrink-0'>
        {text}
      </span>
      {textRight && (
        <>
          <span className='flex-grow overflow-hidden '>{'.'.repeat(500)}</span>
          <span className='flex-shrink-0'>{textRight}</span>
        </>
      )}
    </a>
  </li>
)

interface EntryProps {
  id: string
  text: string
  textRight?: string
}

//   <ul className='list-none'>
//     {allGroups.map(group => (
//       <div className='my-4' key={group.id}>
//         {group.sections.map(section => (
//           <li  key={section.id}>
//             <a href={`#${section.id}`} tabIndex={-1}>
//               {section.name}
//             </a>
//           </li>
//         ))}
//       </div>
//     ))}
//   </ul>
