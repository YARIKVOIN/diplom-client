/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { useState } from 'react'
import { $boilerPart } from '@/context/boilerPart'
import { $mode } from '@/context/mode'
import styles from '@/styles/part/index.module.scss'
import { useEffect} from 'react'
import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { AddBoilerPartsFx, getBoilerPartsFx, updateBoilerPartsFx } from '@/app/api/boilerParts'
import {
  $boilerParts,
  setBoilerParts,
  setBoilerPartsByPopularity,
} from '@/context/boilerParts'
import { IIBoilerPartAdd, IIBoilerPartReplace } from '@/types/boilerparts'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import styless from '@/styles/auth/index.module.scss'
import {ReactSortable} from "react-sortablejs";
import {BounceLoader} from "react-spinners";
import axios from 'axios'
import { getProizvoditelFx } from '@/app/api/proizvoditel'
import { $proizvoditels, setProizvoditels } from '@/context/proizvoditels'
import { getAtributesFx } from '@/app/api/atributes'
import { $atributess, setAtributess } from '@/context/atributess'
import { $Categorys, setCategorys } from '@/context/categorys'
import { getCategoryFx } from '@/app/api/category'

const PartTabs = () => {
  const [showDescription, setShowDescription] = useState(true)
  const [showCompatibility, setShowCompatibility] = useState(false)
  const [showReplace, setshowReplace] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const boilerPart = useStore($boilerPart)
  const proizvoditel = useStore($proizvoditels)
  const atributess = useStore($atributess)
  const categorys = useStore($Categorys)
  const boilerParts = useStore($boilerParts)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const [images,setImages] = useState(boilerPart.images
    ? (JSON.parse(boilerPart.images))
    : []);
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
  } = useForm<IIBoilerPartAdd>()

  const onSubmit = async (data: IIBoilerPartAdd) => {
    try {
      console.log(data.new_);
      setSpinner(true);
      const userData = await AddBoilerPartsFx({
        url: 'boiler-parts/Add',
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

      resetField('memory')
      resetField('price')
      resetField('vendor_code')
      resetField('name')
      resetField('description')
      resetField('images')
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
  var atributaaa = [] as any;
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
  }

  const handleShowCompatibility = () => {
    setShowDescription(false)
    setShowCompatibility(true)
    setshowReplace(false)
  }

  const handleShowReplace = () => {
    setShowDescription(false)
    setShowCompatibility(false)
    setshowReplace(true)
  }

  return (
    <div className={styles.part__tabs}>
      
          <p className={`${styles.part__tabs__content__text} ${darkModeClass}`}>
          <div
      className={`${styless.form} ${darkModeClass}`}
    >
                  <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Добавить товар
      </h2>
      </div>
          <form
      className={`${styless.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
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
        required: 'Выберите память устройства!',
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
        Добавить товар
      </button>
    </form>
          </p>
    </div>
  )
}

export default PartTabs
