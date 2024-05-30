/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { motion } from 'framer-motion'
import { Key, useState } from 'react'
import { $boilerPart } from '@/context/boilerPart'
import { $mode } from '@/context/mode'
import styles from '@/styles/part/index.module.scss'
import { useEffect} from 'react'

import { $shoppingCart } from '@/context/shopping-cart'

import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DeleteBoilerPartsFx, getBoilerPartsFx, updateBoilerPartsFx } from '@/app/api/boilerParts'
import {useRouter} from 'next/router'
import {
  $boilerParts,
  setBoilerParts,
  setBoilerPartsByPopularity,
} from '@/context/boilerParts'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import { IIBoilerPartDelete, IIBoilerPartReplace } from '@/types/boilerparts'
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'
import styless from '@/styles/auth/index.module.scss'
import {ItemInterface, ReactSortable} from "react-sortablejs";
import {BounceLoader} from "react-spinners";
import axios from 'axios'
import { $proizvoditels, setProizvoditels } from '@/context/proizvoditels'
import { $atributess, setAtributess } from '@/context/atributess'
import { $Categorys, setCategorys } from '@/context/categorys'
import { getProizvoditelFx } from '@/app/api/proizvoditel'
import { getAtributesFx } from '@/app/api/atributes'
import { getCategoryFx } from '@/app/api/category'

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
  const proizvoditel = useStore($proizvoditels)
  const atributess = useStore($atributess)
  const categorys = useStore($Categorys)
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
  var atributaaa = [] as any;
  const loadBoilerPart = async () => {
    try {
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      setBoilerParts(data)
      setBoilerPartsByPopularity()
      const data2 = await getProizvoditelFx('/proizvoditel')
      var dataaa2 = {"count": 4, "rows": data2}
      setProizvoditels(dataaa2)
      const data3 = await getAtributesFx('/atributes')
      var dataaa3 = {"count": 4, "rows": data3}
      setAtributess(dataaa3)
      const data4 = await getCategoryFx('/category')
      var dataaa4 = {"count": 4, "rows": data4}
      setCategorys(dataaa4)
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
        atributes: JSON.stringify(atributaaa),
        memory: data.memory, 
        price: data.price, 
        vendor_code: data.vendor_code, 
        name: data.name, 
        description: data.description, 
        images: JSON.stringify(images), 
        in_stock: data.in_stock, 
        bestseller: data.bestseller, 
        new_: data.new_, 
        popularity: data.popularity,  
        model: data.model,
      })

      if (!userData) {
        return
      }

      resetField('id')
      resetField('memory')
      resetField('price')
      resetField('vendor_code')
      resetField('name')
      resetField('description')
      resetField('in_stock')
      resetField('bestseller')
      resetField('new_')
      resetField('popularity')
      resetField('model')
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

  const checkPayment2 = async () => {
    var e = (document.getElementById("organization")) as HTMLSelectElement;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    var CurValue = opt.value;
    if(CurValue != ""){
    var result = prompt("Введите значение для " + CurValue);
    if(result != ""){
    var slovar = {} as any;
    slovar[CurValue] = result;
    atributaaa.push(slovar);
    } else {
      alert("Укажите значение!");
    }
  } else {
    alert("Выберите атрибут из списка!");
  }
  }
  const checkPayment = async () => {
    var result = prompt("Введите наименование атрибута который хотите удалить.");
    const keyToDelete = result;
if (keyToDelete != null){
  atributaaa = atributaaa.filter((obj: any) => !(keyToDelete in obj));
}
  }
  const checkPayment3 = async () => {
    var allatribut = "";
    var result = atributaaa.map((obj: any) => {
      var key = Object.keys(obj)[0];
      var value = obj[key];
      allatribut = allatribut + key + ": " + value + "\n"
    })
    alert(allatribut);
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
          <div
      className={`${styless.form} ${darkModeClass}`}
    >
                  <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Изменить товар
      </h2>
      </div>
          <form
      className={`${styless.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
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
                {proizvoditel.rows?.length ? (proizvoditel.rows.map((item) => (
                <option value={item.proizvoditel}>{item.proizvoditel}</option>
                  ))) : (
                    null
                  )}
                  </select>
  </label>
  <label className={styless.form__label}>
    <select {...register('memory', {
        required: 'Выберите тип товара!',
      })}
      name='memory'
      className={styless.form__input}>
  <option value="">--Тип товара?--</option>
  {categorys.rows?.length ? (categorys.rows.map((item) => (
                <option value={item.category}>{item.category}</option>
                  ))) : (
                    null
                  )}
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
  <label className={styless.form__label}>
  <select 
  id="organization"
                    name='atributes'
                    className={styless.form__input}>
                <option value="">--Добавить атрибут товара--</option>
                {atributess.rows?.length ? (atributess.rows.map((item) => (
                <option value={item.atributes}>{item.atributes}</option>
                  )) ) : (
                    <span>Список атрибутов пуст...</span>
                  )}
                  </select>
  </label>

          <button
      onClick={(e:any) => checkPayment2()}
      type="button"
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Добавить атрибут
      </button>
      <button
      onClick={(e:any) => checkPayment3()}
      type="button"
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Посмотреть атрибуты
      </button>
      <button
      onClick={(e:any) => checkPayment()}
      type="button"
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Удалить атрибут
      </button>
      <button
      type='submit'
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Изменить товар
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
                <ul>
                  <li>Тип товара: {boilerPart.memory}</li>
                  <li>Производитель товара: {boilerPart.model}</li>
                  {JSON.parse(boilerPart.atributes).map((obj: any) => (
                 <li>{Object.keys(obj)[0]}: {obj[Object.keys(obj)[0]]}</li>
))}
</ul>
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
