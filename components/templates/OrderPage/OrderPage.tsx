import { useStore } from 'effector-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  $shoppingCart,
  $totalPrice,
  setShoppingCart,
} from '@/context/shopping-cart'
import { formatPrice } from '@/utils/common'
import OrderAccordion from '@/components/modules/OrderPage/OrderAccordion'
import { $mode } from '@/context/mode'
import { checkPaymentFx, makePaymentFx } from '@/app/api/payment'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import { $user, $userCity } from '@/context/user'
import styles from '@/styles/order/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import emailjs from '@emailjs/browser';
import { $orderReal } from '@/context/orderreal'
import { AddOrderFx, DeleteOrderFx, getOrderbyNameFx, searchPartsFx, updateOrderFx } from '@/app/api/orderRealy'
import { IOrderReal } from '@/types/orderreal'

const OrderPage = () => {
  const mode = useStore($mode)
  const user = useStore($user)
  const order = useStore($orderReal);
  const userCity = useStore($userCity)
  const shoppingCart = useStore($shoppingCart)
  const totalPrice = useStore($totalPrice)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const [orderIsReady, setOrderIsReady] = useState(false)
  const [agreement, setAgreement] = useState(false)
  const spinner = useStore(makePaymentFx.pending)
  const router = useRouter()
  const [spinner2, setSpinner2] = useState(false)
  const handleAgreementChange = () => setAgreement(!agreement)

  useEffect(() => {
    const paymentId = sessionStorage.getItem('paymentId')

    if (paymentId) {
      checkPayment(paymentId)
    }
  }, [])

  const makePay = async () => {
    var mess = "";
    shoppingCart.map((item) => mess = mess + "Наименование: " + item.name + " Количество: " + item.count +"\n");
    await AddOrderFx({
      url: 'order/Add',
      orderlist: mess, 
      fullprice: totalPrice, 
      login: user.username, 
      email: user.email, 
      status: "Оплачивается", 
    })
    try {
      const data = await makePaymentFx({
        url: '/payment',
        amount: totalPrice,
        description: `Заказ №1 ${
          userCity.city.length
            ? `Город: ${userCity.city}, улица: ${userCity.street}`
            : ''
        }`,
      })

      sessionStorage.setItem('paymentId', data.id)
      router.push(data.confirmation.confirmation_url)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
  const checkPayment = async (paymentId: string) => {
    try {
      const data = await checkPaymentFx({
        url: '/payment/info',
        paymentId,
      })

      if (data.status === 'succeeded') {
        const data = await searchPartsFx({
          url: '/order/search',
          search: user.username,
        })
        var mess = ""
        var names = data
          .map((item: IOrderReal) => item.status == "Оплачивается" ? mess = item.orderlist : null )
        var id = 0
        var ids = data
          .map((item: IOrderReal) => item.status == "Оплачивается" ? id = item.id : null )
        var priceeeeee = 0
        var priceee = data
          .map((item: IOrderReal) => item.status == "Оплачивается" ? priceeeeee = item.fullprice : null )
        await updateOrderFx({
          url: 'order/' + id,
          id: id,
          orderlist: mess, 
          fullprice: priceeeeee, 
          login: user.username, 
          email: user.email, 
          status: "Оплачен", 
        })
        var templateParams = {
          message: "Ваш заказ: " + mess + "\n" + " Вы можете забрать заказ на пункте выдачи.",
          email: user.email
        };
        emailjs.send(
          'service_6e2ypg6',
          'template_jr3i30m',
          templateParams,
          '9OjamTrmuS_q5mxoh'
        );
        resetCart();
        return
      } else {
        const data = await searchPartsFx({
          url: '/order/search',
          search: user.username,
        })
        var id = 0
        var ids = data
          .map((item: IOrderReal) => item.status == "Оплачивается" ? id = item.id : null )
        await DeleteOrderFx({url: "order/" + id});

      }
    } catch (error) {
      console.log((error as Error).message)
      resetCart();
    }
  }

  const resetCart = async () => {
    sessionStorage.removeItem('paymentId')
    await removeFromCartFx(`/shopping-cart/all/${user.userId}`)
    setShoppingCart([])
  }

  return (
    <section className={styles.order}>
      <div className="container">
        <h2 className={`${styles.order__title} ${darkModeClass}`}>
          Оформление заказа
        </h2>
        <div className={styles.order__inner}>
          <div className={styles.order__cart}>
            <OrderAccordion
              setOrderIsReady={setOrderIsReady}
              showDoneIcon={orderIsReady}
            />
          </div>
          <div className={styles.order__pay}>
            <h3 className={`${styles.order__pay__title} ${darkModeClass}`}>
              Итого
            </h3>
            <div className={`${styles.order__pay__inner} ${darkModeClass}`}>
              <div className={styles.order__pay__goods}>
                <span>
                  Товары (
                  {shoppingCart.reduce(
                    (defaultCount, item) => defaultCount + item.count,
                    0
                  )}
                  )
                </span>
                <span>{formatPrice(totalPrice)} P</span>
              </div>
              <div className={styles.order__pay__total}>
                <span>На сумму</span>
                <span className={darkModeClass}>
                  {formatPrice(totalPrice)} P
                </span>
              </div>
              <button
                disabled={!(orderIsReady && agreement)}
                className={styles.order__pay__btn}
                onClick={makePay}
              >
                {spinner ? (
                  <span
                    className={spinnerStyles.spinner}
                    style={{ top: '6px', left: '47%' }}
                  />
                ) : (
                  'Подтвердить заказ'
                )}
              </button>
              <label
                className={`${styles.order__pay__rights} ${darkModeClass}`}
              >
                <input
                  className={styles.order__pay__rights__input}
                  type="checkbox"
                  onChange={handleAgreementChange}
                  checked={agreement}
                />
                <span className={styles.order__pay__rights__text}>
                  <strong>Согласен с условиями</strong> Правил пользования
                  торговой площадкой и правилами возврата
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderPage
