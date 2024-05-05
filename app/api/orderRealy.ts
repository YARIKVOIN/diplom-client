import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { IOrderRealAdd, IOrderRealDelete, IOrderRealReplace } from '@/types/orderreal'



export const getOrderFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)
  return data
})

export const getOrderbyIdFx = createEffect(async (url: string) => {
  const { data } = await api.post(url)
  return data
})


export const updateOrderFx = createEffect(
  async ({ url, id, orderlist, fullprice, login, email, status}: IOrderRealReplace) => {
    const { data } = await api.patch(url, { id, orderlist, fullprice, login, email, status })

    return data
  }
)

export const AddOrderFx = createEffect(
  async ({ url, orderlist, fullprice, login, email, status}: IOrderRealAdd) => {
    const { data } = await api.post(url, { orderlist, fullprice, login, email, status})


    return data
  }
)

export const DeleteOrderFx = createEffect(
  async ({ url}: IOrderRealDelete) => {
    const { data } = await api.delete(url)


    return data
  }
)

export const searchOrderFx = createEffect(
  async ({ url, search }: { url: string; search: string }) => {
    const { data } = await api.post(url, { search })

    return data.rows
  }
)

export const getOrderbyNameFx = createEffect(
  async ({ url, login }: { url: string; login: string }) => {
    try {
      const { data } = await api.post(url, { login })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

export const getOrderbyNameStatusFx = createEffect(
  async ({ url, login, status}: { url: string; login: string; status: string }) => {
    try {
      const { data } = await api.post(url, { login, status })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)
export const searchPartsFx = createEffect(
  async ({ url, search }: { url: string; search: string }) => {
    const { data } = await api.post(url, { search })

    return data.rows
  }
)

export const getOrderbyIdStatusFx = createEffect(
  async ({ url, id}: { url: string; id: number;}) => {
    try {
      const { data } = await api.post(url, { id })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)