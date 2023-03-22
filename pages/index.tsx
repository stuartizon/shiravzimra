import type { NextPage } from 'next'
import { SwiperSlide } from 'swiper/react'
import Cover from '../components/cover/Cover'
import { HashNavigation } from 'swiper'
import { ContentsSection } from '../components/contents/Contents'
import SwiperWithControls from '../components/swiperWithControls/SwiperWithControls'
import { allSections } from '../data'

import 'swiper/css'

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

      <div className='mt-10 mb-16'>
        <SwiperWithControls
          modules={[HashNavigation]}
          hashNavigation={{ replaceState: true, watchState: true }}
          // Move the className and style attributes inside the SwiperWithControls class I think, cos its
          // not obvious they apply to the classes on the Swiper, not on this class
          className='bg-white shadow-lg shadow-black'
          style={{ width: 720, minHeight: 1018 }}
        >
          <SwiperSlide data-hash=''>
            <Cover />
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
