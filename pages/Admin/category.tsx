import Head from 'next/head'
import { useCallback, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import AboutPage from '@/components/templates/AboutPage/AboutPage'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import Link from 'next/link'
import styles from '@/styles/header/index.module.scss'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import { setOrderReal, $orderReal } from '@/context/orderreal';
import { toast } from 'react-toastify'
import emailjs from '@emailjs/browser';
import React from 'react'
import styless from '@/styles/auth/index.module.scss'
import { useForm } from 'react-hook-form'
import { ICategory, IICategoryAdd } from '@/types/category'
import { AddCategoryFx, DeleteCategoryFx, getCategoryFx } from '@/app/api/category'
import { $Categorys, setCategorys } from '@/context/categorys'

function Category() {
  const getDefaultTextGenerator = useCallback(() => 'О компании', [])
  const getTextGenerator = useCallback((param: string) => ({}[param]), [])
  const mode = useStore($mode)
  const categorys = useStore($Categorys)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  useEffect(() => {
    loadBoilerParts()
  }, [])

  const refregs = async () => {
    location.reload();
    return
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<IICategoryAdd>()
  const loadBoilerParts = async () => {
    try {
      const data = await getCategoryFx('/category')
      var dataaa = {"count": 4, "rows": data}
      setCategorys(dataaa)
      return
    } catch (error) {
      toast.error((error as Error).message)
    }
    }
    const checkPayment = async (item: ICategory) => {
        var result = prompt("Введите тип товара для его удаления.");
        if(item.category == result){
        await DeleteCategoryFx({
          url: 'category/' + item.id,
        })
        location.reload();
      }
        else{
          alert("Тип товара введен неверно.")
        }
      }
      const onSubmit = async (data: IICategoryAdd) => {
        try {
          const userData = await AddCategoryFx({
            url: 'category/Add',
            category: data.category, 
          })
    
          if (!userData) {
            return
          }
    
          resetField('category');
          refregs();
        } catch (error) {
          toast.error((error as Error).message)
        } finally {
        }
      }
      

  return (
    <>
      <Head>
        <title>Гаджетмен | Панель администратора</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Layout>
        <main>
            <div className={`${styles.divdivdiv}`}>
        <Link href="/Admin/PartPage" passHref legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link__link2} ${darkModeClass}`}
                >
                  Добавить товар
                </a>
              </Link>
              </div>
              <div className={`${styles.divdivdiv}`}>
        <Link href="/Admin/proizvoditel" passHref legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link__link2} ${darkModeClass}`}
                >
                  Добавить производителя
                </a>
              </Link>
              </div>
              <div className={`${styles.divdivdiv}`}>
              <Link href="/Admin/atributes" passHref legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link__link2} ${darkModeClass}`}
                >
                  Добавить атрибут
                </a>
              </Link>
              </div>
              <div className={`${styles.divdivdiv}`}>
              <Link href="/Admin" passHref legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link__link2} ${darkModeClass}`}
                >
                  Выдача заказа
                </a>
              </Link>
              </div>
              <div>
              <form
      className={`${styless.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Добавить тип товара
      </h2>
      <label className={styless.form__label}>
    <input
      {...register('category', {
        required: 'Введите тип товара!',
        minLength: 2,
        maxLength: 255,
      })}
      className={styless.form__input}
      type="text"
      placeholder="Тип товара"
      name='category'
    />
    {errors.category && (
      <span className={styless.error_alert}>{errors.category?.message}</span>
    )}
    {errors.category && errors.category.type === 'minLength' && (
      <span className={styless.error_alert}>Минимум 2 символов!</span>
    )}
    {errors.category && errors.category.type === 'maxLength' && (
      <span className={styless.error_alert}>Не более 255 символов!</span>
    )}
  </label>
      <button
      type='submit'
        className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`}
      >
        Добавить
      </button>
    </form>
              </div>
              <div>
              <table className={`${styles.resp_tab}`}>
    <thead>
        <tr>
            <th>Тип товара</th>
            <th>Удалить</th>
        </tr>
    </thead>
    <tbody>
        {categorys.rows?.length ? (
                  categorys.rows.map((item) => (
                    <tr>
                    <td>{item.category}</td>
                    <td><button className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`} onClick={(e:any) => checkPayment(item)}>Удалить</button></td>
                    </tr>
                  ))
                ) : (
                  <span>Список типа товара пуст...</span>
                )}
    </tbody>
</table>  
              </div>
              
        </main>
      </Layout>
    </>
  )
}

export default Category