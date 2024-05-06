import { useStore } from 'effector-react'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { $boilerPart } from '@/context/boilerPart'
import { $mode } from '@/context/mode'
import { $shoppingCart } from '@/context/shopping-cart'
import { toggleCartItem } from '@/utils/shopping-cart'
import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PartTabs from './PartTabs'
import { AddBoilerPartsFx, getBoilerPartsFx } from '@/app/api/boilerParts'
import {
  setBoilerParts,
  setBoilerPartsByPopularity,
} from '@/context/boilerParts'
import styles from '@/styles/part/index.module.scss'
import { IIBoilerPartAdd } from '@/types/boilerparts'
import { useForm } from 'react-hook-form'
import styless from '@/styles/auth/index.module.scss'
import { ReactSortable } from 'react-sortablejs'
import { BounceLoader } from 'react-spinners'
import axios from 'axios'
import Link from 'next/link'
import Header from '@/components/modules/Header/Header'

const PartPage = () => {
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const boilerPart = useStore($boilerPart)
  const cartItems = useStore($shoppingCart)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.partId === boilerPart.id)
  const [images, setImages] = useState(boilerPart.images ? (JSON.parse(boilerPart.images)) : []);
    // console.log(boilerPart.images);
const [isUploading,setIsUploading] = useState(false);
async function uploadImages(ev: { target: { files: any } }) {
  const files = ev.target?.files;
  if (files?.length > 0) {
    setIsUploading(true);
    const data = new FormData();
    for (const file of files) {
      data.append('file', file);
    }
    const res = await axios.post('../api/upload', data);
    setImages((oldImages: string[]) => {
      return [...oldImages, ...res.data.links];
    });
    setIsUploading(false);
  }
}
function updateImagesOrder(images: any) {
  setImages(images);
}

  useEffect(() => {
    loadBoilerPart()
  }, [])

  const loadBoilerPart = async () => {
    try {
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      setBoilerParts(data)
      setBoilerPartsByPopularity()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<IIBoilerPartAdd>()

  const onSubmit = async (data: IIBoilerPartAdd) => {
    try {
      const userData = await AddBoilerPartsFx({
        url: 'boiler-parts/Add',
        memory: data.memory, 
        price: data.price, 
        proccesor: data.proccesor, 
        vendor_code: data.vendor_code, 
        name: data.name, 
        description: data.description, 
        images: JSON.stringify(images), 
        in_stock: data.in_stock, 
        bestseller: data.bestseller, 
        new_: data.new_, 
        popularity: data.popularity,  
        display: data.display, 
        model: data.model, 
        camera: data.camera,
      })

      if (!userData) {
        return
      }

      resetField('memory')
      resetField('price')
      resetField('proccesor')
      resetField('vendor_code')
      resetField('name')
      resetField('description')
      resetField('images')
      resetField('in_stock')
      resetField('bestseller')
      resetField('new_')
      resetField('popularity')
      resetField('display')
      resetField('model')
      resetField('camera')
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
    }
  }

  const toggleToCart = () =>
    toggleCartItem(user.username, boilerPart.id, isInCart)

  return (
      <div className="container">
        <Header />
        <div className={`${styles.divdivdiv}`}>
              <Link href="/Admin" passHref legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link__link2} ${darkModeClass}`}
                >
                  Список заказов
                </a>
              </Link>
              </div>
        {!isMobile && <PartTabs />}
        {isMobile && (
          <div className={styles.part__accordion}>

              <div
                className={`${styles.part__accordion__content} ${darkModeClass}`}
              >
                <p
                  className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                >
                  <form
      className={`${styless.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Добавить товар
      </h2>
  <div className={styles.partdiv}>
    <ReactSortable
      list={images as any}
      className={styles.partdiv2}
      setList={updateImagesOrder}>
      {!!images?.length && images.map((link: any) => (
        <div key={link} className={styles.partdiv3}>
          <img src={link} alt="" className={styles.partdiv4}/>
        </div>
      ))}
    </ReactSortable>
    {isUploading && (
      <div className={styles.partdiv5}>
        <BounceLoader color={'#1E3A8A'} speedMultiplier={2} />
      </div>
    )}
    <label className={styles.partdiv6}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.partdiv7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
      <div>
        Добавить
      </div>
      <input {...register('images')}
      type="file" onChange={uploadImages} className={styles.partdiv8} name='images'/>
    </label>
  </div>
      <label className={styless.form__label}>
    <input
      {...register('vendor_code', {
        required: 'Введите артикул!',
        minLength: 2,
        maxLength: 15,
        pattern: {
          value: /^[0-9]*$/,
          message: 'Недопустимое значение!',
        },
      })}
      className={styless.form__input}
      type="number"
      placeholder="Артикул"
      value = "12345"
      hidden
      name='vendor_code'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 2 символа!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 15 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <input
      {...register('proccesor', {
        required: 'Введите процессор!',
        minLength: 5,
        maxLength: 255,
      })}
      className={styless.form__input}
      type="text"
      placeholder="Процессор"
      name='proccesor'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 5 символов!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 255 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <input
      {...register('price', {
        required: 'Введите цену!',
        pattern: {
            value: /^[0-9]*$/,
            message: 'Недопустимое значение!',
          },
      })}
      name='price'
      className={styless.form__input}
      type="number"
      placeholder="Цена"
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
  </label>
  <label className={styless.form__label}>
    <input
      {...register('popularity', {
        required: 'Введите популярность!',
        minLength: 1,
        maxLength: 3,
        pattern: {
            value: /^[0-9]*$/,
            message: 'Недопустимое значение!',
          },
      })}
      className={styless.form__input}
      type="number"
      name='popularity'
      placeholder='Популярность от 0 до 999'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 1 символов!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 3 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <select {...register('new_', {
        required: 'Выберите статус новинки!',
      })}
      name='new_'
      className={styless.form__input}>
  <option value="">--Товар новинка?--</option>
  <option value="true">Да</option>
  <option value="false">Нет</option>
</select>
  </label>
  <label className={styless.form__label}>
    <input
      {...register('name', {
        required: 'Введите название!',
        minLength: 5,
        maxLength: 255,
      })}
      className={styless.form__input}
      type="text"
      placeholder="Название"
      name='name'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 5 символов!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 255 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <select {...register('model', {
        required: 'Выберите производителя!',
      })}
      name='model'
      className={styless.form__input}>
  <option value="">--Производитель товара?--</option>
  <option value="Apple">Apple</option>
  <option value="Samsung">Samsung</option>
  <option value="Xiaomi">Xiaomi</option>
  <option value="Lenovo">Lenovo</option>
  <option value="Asus">Asus</option>
  <option value="LG">LG</option>
  <option value="Acer">Acer</option>
  <option value="Huawei">Huawei</option>
  <option value="Honor">Honor</option>
  <option value="Poco">Poco</option>
</select>
  </label>
  <label className={styless.form__label}>
    <select {...register('memory', {
        required: 'Выберите память устройства!',
      })}
      name='memory'
      className={styless.form__input}>
  <option value="">--Память товара?--</option>
  <option value="32GB">32GB</option>
  <option value="64GB">64GB</option>
  <option value="128GB">128GB</option>
  <option value="256GB">256GB</option>
  <option value="512GB">512GB</option>
  <option value="1TB">1TB</option>
</select>
  </label>
  <label className={styless.form__label}>
    <input
      {...register('in_stock', {
        required: 'Введите количество товара!',
        minLength: 2,
        maxLength: 15,
        pattern: {
          value: /^[0-9]*$/,
          message: 'Недопустимое значение!',
        },
      })}
      className={styless.form__input}
      type="number"
      placeholder="Количество"
      name='in_stock'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 2 символа!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 15 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <input
      {...register('display', {
        required: 'Введите дисплей!',
        minLength: 5,
        maxLength: 255,
      })}
      name='display'
      className={styless.form__input}
      type="text"
      placeholder="Дисплей гаджета"
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 5 символов!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 255 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <input
      {...register('description', {
        required: 'Введите описание!',
      })}
      className={styless.form__input}
      type="text"
      placeholder="Описание гаджета"
      name='description'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
  </label>
  <label className={styless.form__label}>
    <input
      {...register('camera', {
        required: 'Введите камеру!',
        minLength: 5,
        maxLength: 255,
      })}
      className={styless.form__input}
      type="text"
      placeholder="Камера гаджета"
      name='camera'
    />
    {errors.name && (
      <span className={styless.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 5 символов!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 255 символов!</span>
    )}
  </label>
  <label className={styless.form__label}>
    <select {...register('bestseller', {
        required: 'Выберите статус хита!',
      })}
      name='bestseller'
      className={styless.form__input}>
  <option value="">--Товар хит?--</option>
  <option value="true">Да</option>
  <option value="false">Нет</option>
</select>
  </label>
      <button
      type='submit'
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Добавить
      </button>
    </form>
                </p>
              </div>
          </div>
        )}
      </div>
  )
}

export default PartPage
