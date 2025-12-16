import type { NextPage } from 'next'
import { Cover } from '../../components/cover/Cover'
import { SwiperSlide } from 'swiper/react'
import { HashNavigation } from 'swiper/modules'
import { ContentsSection } from '../../components/contents/Contents'
import SwiperWithControls from '../../components/swiperWithControls/SwiperWithControls'
import { allSections } from '../../data'

import 'swiper/css'
import Head from 'next/head'
import { TableOfContents } from '../../components/table-of-contents/TableOfContents'

const Index: NextPage = () => {
  return (
    <>
      {/* <Nav /> */}
      {/* <div className='text-white text-6xl text-center'>Shira v'Zimra</div> */}
      {/* <div className='text-white text-2xl text-center mt-8'> */}
      {/* A book of Jewish music for the synagogue and the home, */}
      {/* </div> */}
      {/* <div className='text-white text-2xl text-center mb-8'> */}
      {/* arranged for male voice choir */}
      {/* </div> */}
      {/* <div className='my-5' /> */}

      <Head>
        <title>Shira v&apos;Zimra</title>
        <meta
          name='description'
          content='A book of Jewish music for the synagogue and the home, arranged for male voice choir by Stuart Izon'
        />
        <meta name='author' content='Stuart Izon' />
      </Head>

      <div className='md:mt-10 md:mb-16 mb-2 mt-2'>
        <SwiperWithControls
          modules={[HashNavigation]}
          hashNavigation={{ replaceState: true, watchState: true }}
          className='page'
          // Move the className and style attributes inside the SwiperWithControls class I think, cos its
          // not obvious they apply to the classes on the Swiper, not on this class
          // style={{ minHeight: 1018 }}
        >
          <SwiperSlide data-hash=''>
            <Cover />
          </SwiperSlide>
          <SwiperSlide data-hash='contents'>
            <TableOfContents />
          </SwiperSlide>
          {allSections.map(section => (
            <SwiperSlide data-hash={section.id} key={section.id}>
              <ContentsSection section={section} />
            </SwiperSlide>
          ))}
        </SwiperWithControls>
      </div>
    </>
  )
}

export default Index
