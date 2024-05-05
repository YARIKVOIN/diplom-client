import { IOrderReals } from '@/types/orderreal'
import { createDomain } from 'effector-next'

const orderReals = createDomain()

export const setOrderReals = orderReals.createEvent<IOrderReals>()

export const $orderReals = orderReals
  .createStore<IOrderReals>({} as IOrderReals)
  .on(setOrderReals, (_, parts) => parts)