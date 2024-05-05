/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import styles from '@/styles/about/index.module.scss'

const AboutPage = () => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  return (
    <section className={styles.about}>
      <div className="container">
        <h2 className={`${styles.about__title} ${darkModeClass}`}>
          О компании
        </h2>
        <div className={styles.about__inner}>
          <div className={`${styles.about__info} ${darkModeClass}`}>
            <p>
              Компания &quot;Гаджетмен&quot; предлагает Вам смартфоны, ноутбуки, планшеты
              лучшего качества. 99% гаджетов представленных на сайте постоянно
              поддерживаются в наличии на нашем складе.
            </p>
            <p>
              Ассортимент интернет-магазина &quot;Гаджетмен&quot; включает в
              себя самые популярные фирмы продаж смартфонов, ноутбуков и планшетов. С нами сотрудничают следующие фирмы: 
              Apple, Samsung, Xiaomi, Lenova, Asus, LG, Acer, Huawei, Honor, Poco.
            </p>
          </div>
          <div className={`${styles.about__img} ${styles.about__img__top}`}>
            <img src="/img/pcb-assembly封面.webp" alt="image-1" />
          </div>
          <div className={`${styles.about__img} ${styles.about__img__bottom}`}>
            <img src="/img/d3214d60f95fe047ea28e4cb616fc561.jpg" alt="image-2" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
