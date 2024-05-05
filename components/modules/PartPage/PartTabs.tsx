/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { motion } from 'framer-motion'
import { Key, useState } from 'react'
import { $boilerPart } from '@/context/boilerPart'
import { $mode } from '@/context/mode'
import styles from '@/styles/part/index.module.scss'
import { useEffect} from 'react'
import PartImagesList from '@/components/modules/PartPage/PartImagesList'
import { formatPrice } from '@/utils/common'
import { $shoppingCart } from '@/context/shopping-cart'
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg'
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { toggleCartItem } from '@/utils/shopping-cart'
import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { DeleteBoilerPartsFx, getBoilerPartsFx, updateBoilerPartsFx } from '@/app/api/boilerParts'
import {useRouter} from 'next/router'
import {
  $boilerParts,
  setBoilerParts,
  setBoilerPartsByPopularity,
} from '@/context/boilerParts'
import PartAccordion from '@/components/modules/PartPage/PartAccordion'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import { IIBoilerPartDelete, IIBoilerPartReplace } from '@/types/boilerparts'
import { useForm } from 'react-hook-form'
import BestsellerInput from '@/components/elements/ReplaceBoiler/BestsellerInput'
import CameraInput from '@/components/elements/ReplaceBoiler/CameraInput'
import DescriptionInput from '@/components/elements/ReplaceBoiler/DescriptionInput'
import DisplayInput from '@/components/elements/ReplaceBoiler/DisplayInput'
import In_stockInput from '@/components/elements/ReplaceBoiler/In_stockInput'
import MemoryInput from '@/components/elements/ReplaceBoiler/MemoryInput'
import New_Input from '@/components/elements/ReplaceBoiler/New_Input'
import PopularityInput from '@/components/elements/ReplaceBoiler/PopularityInput'
import PriceInput from '@/components/elements/ReplaceBoiler/PriceInput'
import ProccesorInput from '@/components/elements/ReplaceBoiler/ProccesorInput'
import Vendor_codeInput from '@/components/elements/ReplaceBoiler/Vendor_codeInput'
import NameInput from '@/components/elements/ReplaceBoiler/NameInput'
import ImagesInput from '@/components/elements/ReplaceBoiler/imagesInput'
import { toast } from 'react-toastify'
import NextApiResponse from 'next';
import styless from '@/styles/auth/index.module.scss'
import {ItemInterface, ReactSortable} from "react-sortablejs";
import {BounceLoader} from "react-spinners";
import axios from 'axios'
import src from 'react-select/dist/declarations/src'

const PartTabs = () => {
  const [showDescription, setShowDescription] = useState(true)
  const [showCompatibility, setShowCompatibility] = useState(false)
  const [showReplace, setshowReplace] = useState(false)
  const [showDelete, setshowDelete] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const boilerPart = useStore($boilerPart)
  const boilerParts = useStore($boilerParts)
  const cartItems = useStore($shoppingCart)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.partId === boilerPart.id)
  const spinnerToggleCart = useStore(removeFromCartFx.pending)
  const spinnerSlider = useStore(getBoilerPartsFx.pending)
  const [images,setImages] = useState(boilerPart.images
    ? (JSON.parse(boilerPart.images))
    : []);
const [isUploading,setIsUploading] = useState(false);
const router = useRouter()
    const [route, setRoute] = useState()

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
  } = useForm<IIBoilerPartReplace>()

  const onSubmit = async (data: IIBoilerPartReplace) => {
    try {
      setSpinner(true);
      const userData = await updateBoilerPartsFx({
        url: 'boiler-parts/' + data.id,
        id: data.id,
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

      resetField('id')
      resetField('memory')
      resetField('price')
      resetField('proccesor')
      resetField('vendor_code')
      resetField('name')
      resetField('description')
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
      setSpinner(false)
    }
  }

  const onSubmit2 = async (data: IIBoilerPartDelete) => {
    try {
      setSpinner(true);
      const userData = await DeleteBoilerPartsFx({
        url: 'boiler-parts/' + data.id
      })

      if (!userData) {
        return
      }

      resetField('id')
      router.push("/")
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
  const handleShowDescription = () => {
    setShowDescription(true)
    setShowCompatibility(false)
    setshowReplace(false)
    setshowDelete(false)
  }

  const handleShowCompatibility = () => {
    setShowDescription(false)
    setShowCompatibility(true)
    setshowReplace(false)
    setshowDelete(false)
  }

  const handleShowReplace = () => {
    setShowDescription(false)
    setShowCompatibility(false)
    setshowReplace(true)
    setshowDelete(false)
  }
  const handleShowDelete = () => {
    setShowDescription(false)
    setShowCompatibility(false)
    setshowReplace(false)
    setshowDelete(true)
  }

  return (
    <div className={styles.part__tabs}>
      <div className={`${styles.part__tabs__controls} ${darkModeClass}`}>
        <button
          className={showDescription ? styles.active : ''}
          onClick={handleShowDescription}
        >
          Описание
        </button>
        <button
          className={showCompatibility ? styles.active : ''}
          onClick={handleShowCompatibility}
        >
          Характеристики
        </button>
        {user.role == "Admin" && <><button
          className={showReplace ? styles.active : ''}
          onClick={handleShowReplace}
        >
          Изменить
        </button><button
          className={showDelete ? styles.active : ''}
          onClick={handleShowDelete}
        >
            Удалить
          </button></>
}
      </div>
      {showDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.part__tabs__content}
        >
          <h3
            className={`${styles.part__tabs__content__title} ${darkModeClass}`}
          >
            {boilerPart.name}
          </h3>
          <p className={`${styles.part__tabs__content__text} ${darkModeClass}`}>
            {boilerPart.description}
          </p>
        </motion.div>
      )}
      {showReplace && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.part__tabs__content}
        >
          <p className={`${styles.part__tabs__content__text} ${darkModeClass}`}>
          <form
      className={`${styless.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Изменить товар
      </h2>
      <label className={styless.form__label__label}>
    <input
      {...register('id', {
        required: 'Ошибка!',
      })}
      className={styless.form__input}
      type="number"
      value={boilerPart.id}
      readOnly
      name='id'
    />
    </label>
    {/* <label className={styless.form__label}>
    <input
      {...register('images', {
        required: 'Ошибка!',
      })}
      className={styless.form__input}
      type="text"
      value={"[\"https://sun9-17.userapi.com/impg/9vBFMx0RHTJ0hXCE5xon2sM4w6SXDuhsDGWfBQ/8ZYFbT8kg3E.jpg?size=1280x720&quality=95&sign=7d191123bcb3db56d1d608d6a3a1168e&c_uniq_tag=07SHq9h67gJ1fjFuKBiiPcZpZbdxb5MK8Bp1rRQSNEI&type=album\", \"https://resizer.mail.ru/p/e77c6cfe-7516-5d03-8b6f-631e9c583367/AQAKF4BK6-RKRkmdClhSx2pwVF78qDA_dpOBrsZf-qImMawlSjzBbJRAjnCTJ8mYJ-z4D_RZH-OxdZVOjHjw76r8SdM.jpg\", \"https://cdn.mos.cms.futurecdn.net/Pyma6LSPSGupqqWVwLYuJg.jpg\"]"}
      readOnly
      name='images'
    />
  </label> */}
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
      {/* <NameInput register={register} errors={errors} />
      <BestsellerInput register={register} errors={errors} />
      <CameraInput register={register} errors={errors} />
      <DescriptionInput register={register} errors={errors} />
      <DisplayInput register={register} errors={errors} /> */}
      {/* <ImagesInput register={register} errors={errors} /> */}
      {/* <In_stockInput register={register} errors={errors} />
      <MemoryInput register={register} errors={errors} />
      <New_Input register={register} errors={errors} />
      <PopularityInput register={register} errors={errors} />
      <PriceInput register={register} errors={errors} />
      <ProccesorInput register={register} errors={errors} />
      <Vendor_codeInput register={register} errors={errors} /> */}
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
        Изменить
      </button>
    </form>
          </p>
        </motion.div>
      )}
      {showCompatibility && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.part__tabs__content}
        >
          <p className={`${styles.part__tabs__content__text} ${darkModeClass}`}>
          Оперативная память: {boilerPart.memory} <br></br>
                  Процессор: {boilerPart.proccesor} <br></br>
                  Дисплей: {boilerPart.display} <br></br>
                  Производитель: {boilerPart.model} <br></br>
                  Камера: {boilerPart.camera}
          </p>
        </motion.div>
      )}
      {showDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.part__tabs__content}
        >
              <div
                className={`${styles.part__accordion__content} ${darkModeClass}`}
              >
                <p
                  className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                >
                  <form className={`${styless.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit2)}
    >
      <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Удалить товар
      </h2>
                  <label className={styless.form__label__label}>
    <input
      {...register('id', {
        required: 'Ошибка!',
      })}
      className={styless.form__input}
      type="number"
      value={boilerPart.id}
      readOnly
      name='id'
    />
     </label>
                    <button
      type='submit'
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Удалить
      </button></form>
                </p>
              </div>
        </motion.div>
      )}
    </div>
  )
}

export default PartTabs
