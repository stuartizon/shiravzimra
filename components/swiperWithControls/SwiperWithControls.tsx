import { useState } from 'react'
import { Swiper as SwiperClass } from 'swiper/types'
import { Swiper, SwiperProps } from 'swiper/react'
import ButtonNext from './ButtonNext'
import ButtonPrev from './ButtonPrev'

const SwiperWithControls: React.FC<SwiperProps> = props => {
  const [swiper, setSwiper] = useState<SwiperClass>()
  const [isBeginning, setBeginning] = useState<boolean>()
  const [isEnd, setEnd] = useState<boolean>()

  const onSwiper = (s: SwiperClass) => {
    setSwiper(s)
    setBeginning(s.isBeginning)
    setEnd(s.isEnd)
  }

  const onSlideChange = () => {
    setBeginning(swiper?.isBeginning)
    setEnd(swiper?.isEnd)
  }

  const onPrevious = () => swiper?.slidePrev()
  const onNext = () => swiper?.slideNext()

  return (
    <div className='flex justify-center gap-x-2'>
      <ButtonPrev isBeginning={isBeginning} onPrevious={onPrevious} />
      <div>
        <Swiper {...props} onSwiper={onSwiper} onSlideChange={onSlideChange} />
      </div>
      <ButtonNext isEnd={isEnd} onNext={onNext} />
    </div>
  )
}

export default SwiperWithControls
