
import { IOrderReal } from '@/types/orderreal'
import { createDomain } from 'effector-next'

const orderReal = createDomain()

export const setOrderReal = orderReal.createEvent<IOrderReal>()

export const $orderReal = orderReal
  .createStore<IOrderReal>({} as IOrderReal)
  .on(setOrderReal, (_, part) => part)
