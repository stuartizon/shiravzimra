export { default } from './index'

import { GetStaticPaths, GetStaticProps } from 'next'
import { allPieces, allSections } from '../data'

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [
    ...allPieces.map(p => ({ params: { chapter: p.id } })),
    ...allSections.map(s => ({ params: { chapter: s.id } })),
    { params: { chapter: 'preface' } },
    { params: { chapter: 'tableOfContents' } },
  ],
  fallback: false
})
