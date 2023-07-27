import { PropsWithChildren } from 'react'
import { FC } from 'react'

export const Sheet: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='bg-white page shadow-lg shadow-black'>
      {children}
    </div>
  )
}
