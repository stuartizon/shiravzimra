import { forwardRef, useState } from 'react'
import { Swiper as SwiperClass } from 'swiper/types'
import { Swiper, SwiperProps } from 'swiper/react'
import { Sheet } from '../sheet/Sheet'
import ButtonNext from './ButtonNext'
import ButtonPrev from './ButtonPrev'

import 'swiper/css'

const SwiperWithControls = forwardRef<HTMLDivElement, SwiperProps>(
  (props, ref) => {
    const [swiper, setSwiper] = useState<SwiperClass>()
    const [isBeginning, setBeginning] = useState<boolean>(true)
    const [isEnd, setEnd] = useState<boolean>(true)

    const onSwiper = (s: SwiperClass) => {
      setSwiper(s)
      props.onSwiper?.(s)
    }

    const onUpdate = (s: SwiperClass) => {
      setBeginning(s.isBeginning)
      setEnd(s.isEnd)
    }

    const onSlideChange = (s: SwiperClass) => {
      setBeginning(s.isBeginning)
      setEnd(s.isEnd)
      props.onSlideChange?.(s)
    }

    const onPrevious = () => swiper?.slidePrev()
    const onNext = () => swiper?.slideNext()

    return (
      <div className='mx-auto'>
        <div className='flex gap-x-2 justify-center'>
          <ButtonPrev isBeginning={isBeginning} onPrevious={onPrevious} />
          <Sheet>
            <div className='' ref={ref}>
              <Swiper
                {...props}
                onSwiper={onSwiper}
                onSlideChange={onSlideChange}
                onUpdate={onUpdate}
              />
            </div>
          </Sheet>
          <ButtonNext isEnd={isEnd} onNext={onNext} />
        </div>
      </div>
    )
  }
)

SwiperWithControls.displayName = 'SwiperWithControls'

export default SwiperWithControls
