/* eslint-disable @next/next/no-img-element */
import Slider from 'react-slick'
import { useStore } from 'effector-react'
import { useEffect } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { $mode } from '@/context/mode'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import BrandsSliderNextArrow from '@/components/elements/BrandsSliderNextArrow/BrandsSliderNextArrow'
import BrandsSliderPrevArrow from '@/components/elements/BrandsSliderPrevArrow/BrandsSliderPrevArrow'
import styles from '@/styles/dashboard/index.module.scss'

const BrandsSlider = () => {
  const isMedia768 = useMediaQuery(768)
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const brandItems = [
    { id: 1, img: '/img/brand1.png', alt: 'brand-1' },
    { id: 2, img: '/img/brand2.png', alt: 'brand-2' },
    { id: 3, img: '/img/brand3.png', alt: 'brand-3' },
    { id: 4, img: '/img/brand4.png', alt: 'brand-4' },
    { id: 5, img: '/img/brand5.png', alt: 'brand-5' },
    { id: 6, img: '/img/brand6.png', alt: 'brand-6' },
    { id: 7, img: '/img/brand7.png', alt: 'brand-7' },
    { id: 8, img: '/img/brand8.png', alt: 'brand-8' },
    { id: 9, img: '/img/brand10.png', alt: 'brand-10' },
  ]

  useEffect(() => {
    const slider = document.querySelector(
      `.${styles.dashboard__brands__slider}`
    )

    const list = slider?.querySelector('.slick-list') as HTMLElement

    list.style.height = isMedia768 ? '60px' : '80px'
  }, [isMedia768])

  const settings = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    variableWidth: true,
    autoplay: true,
    speed: 500,
    nextArrow: <BrandsSliderNextArrow modeClass={darkModeClass} />,
    prevArrow: <BrandsSliderPrevArrow modeClass={darkModeClass} />,
  }

  return (
    <Slider {...settings} className={styles.dashboard__brands__slider}>
      {brandItems.map((item) => (
        <div
          className={`${styles.dashboard__brands__slide} ${darkModeClass}`}
          key={item.id}
          style={{ width: isMedia768 ? 124 : 180 }}
        >
          <img src={item.img} alt={item.alt} />
        </div>
      ))}
    </Slider>
  )
}

export default BrandsSlider
