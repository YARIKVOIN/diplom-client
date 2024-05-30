import Head from 'next/head'
import { useCallback, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import AboutPage from '@/components/templates/AboutPage/AboutPage'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import Link from 'next/link'
import styles from '@/styles/header/index.module.scss'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import { getOrderbyIdFx, getOrderFx, searchPartsFx, updateOrderFx } from '@/app/api/orderRealy'
import { setOrderReal, $orderReal } from '@/context/orderreal';
import { toast } from 'react-toastify'
import { IOrderReal } from '@/types/orderreal'
import { $orderReals, setOrderReals } from '@/context/orderreals'
import emailjs from '@emailjs/browser';
import React from 'react'
import styless from '@/styles/auth/index.module.scss'

function Admin() {
  const getDefaultTextGenerator = useCallback(() => 'О компании', [])
  const getTextGenerator = useCallback((param: string) => ({}[param]), [])
  const mode = useStore($mode)
  const [email, setEmail] = React.useState('');
  const [email2, setEmail2] = React.useState('');
  const orderReals = useStore($orderReals)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  useEffect(() => {
    loadBoilerParts()
  }, [])

  useEffect(() => {
    loadBoilerParts2()
  }, [email])

  useEffect(() => {
    loadBoilerParts3()
  }, [email2])

  const refregs = async () => {
    location.reload();
    return
  }
  const loadBoilerParts2 = async () => {
    try {
      const data = await searchPartsFx({
        url: '/order/search',
        search: email,
      })
      var dataaa = {"count": 4, "rows": data}
      setOrderReals(dataaa)
      return
    }catch (error) {
      toast.error((error as Error).message)
    }
    }
    function filterByStatus(dataArray: IOrderReal[], status: string) {
      return dataArray.filter(item => item.status === status);
    }
    const loadBoilerParts3 = async () => {
      try {
        const data = await searchPartsFx({
          url: '/order/search',
          search: email2,
        })
        var newArray = filterByStatus(data, 'Оплачен');
        
        var dataaa = {"count": 4, "rows": newArray}
        setOrderReals(dataaa)
        return
      }catch (error) {
        toast.error((error as Error).message)
      }
      }
  const loadBoilerParts = async () => {
    try {
      const data = await getOrderFx('/order')
      var dataaa = {"count": 4, "rows": data}
      setOrderReals(dataaa)
      return
    } catch (error) {
      toast.error((error as Error).message)
    }
    }
    function getRandomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min) + min)
  }  
    const checkPayment = async (item: IOrderReal) => {
      if(item.status == "Оплачен"){
      var codee = getRandomNumber(1000, 10000);
      console.log(codee);
      var templateParams = {
        message: "Ваш заказ на гране выдачи, если это не вы, то свяжитесь с нами! По номеру +7(999)999-99-99." + "\n" + "Для подтверждения выдачи заказа, скажите сотруднику следующий код: " + codee,
        email: item.email
      };
      emailjs.send(
        'service_6e2ypg6',
        'template_jr3i30m',
        templateParams,
        '9OjamTrmuS_q5mxoh'
      );
      var result = prompt("Введите код отправленный на почту пользователю.");
      if(codee == Number(result)){
      await updateOrderFx({
        url: 'order/' + item.id,
        id: item.id,
        orderlist: item.orderlist, 
        fullprice: item.fullprice, 
        login: item.login, 
        email: item.email, 
        status: "Выдан", 
      })
      location.reload();
    }
      else{
        alert("Код введен неверно.")
      }
    } else {
      alert("Данный заказ выдан или не оплачен.")
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
        <Link href="/Admin/category" passHref legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link__link2} ${darkModeClass}`}
                >
                  Добавить тип товара
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
              <div>
              <input type='email' id='email' placeholder='Поиск всех заказов' value={email} onChange={(e) => setEmail(e.target.value)} className={styles.form__input}/>
              </div>
              <div>
              <input type='email2' id='email2' placeholder='Поиск заказов на выдачу' value={email2} onChange={(e) => setEmail2(e.target.value)} className={styles.form__input}/>
              </div>
              <div>
              <button className={styles.form__input} onClick={(e:any) => refregs()}>Сбросить</button>
              </div>
              <div>
              <table className={`${styles.resp_tab}`}>
    <thead>
        <tr>
            <th>Список товара</th>
            <th>Итоговая цена</th>
            <th>Логин</th>
            <th>Почта</th>
            <th>Статус</th>
            <th>Выдать</th>
        </tr>
    </thead>
    <tbody>
        {orderReals.rows?.length ? (
                  orderReals.rows.map((item) => (
                    <tr>
                    <td>{item.orderlist}</td>
                    <td>{item.fullprice}</td>
                    <td>{item.login}</td>
                    <td>{item.email}</td>
                    <td>{item.status}</td>
                    <td><button className={`${styless.form__button} ${styless.button} ${styless.submit} ${darkModeClass}`} onClick={(e:any) => checkPayment(item)}>Выдать</button></td>
                    </tr>
                  ))
                ) : (
                  <span>Список заказов пуст...</span>
                )}
    </tbody>
</table>  
              </div>
              
        </main>
      </Layout>
    </>
  )
}

export default Admin
