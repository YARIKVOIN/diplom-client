import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { IBoilerPartAdd, IBoilerPartDelete, IBoilerPartReplace } from '@/types/boilerparts'

export const getBestsellersOrNewPartsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

export const getBoilerPartsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)
  console.log(url);
  return data
})

export const updateBoilerPartsFx = createEffect(
  async ({ url, id, memory, price, proccesor, vendor_code, name, description, images, in_stock, bestseller, new_, popularity,  display, model, camera}: IBoilerPartReplace) => {
    const { data } = await api.patch(url, { id, memory, price, proccesor, vendor_code, name, description, images, in_stock, bestseller, new_, popularity,  display, model, camera })

    if (data.warningMessage) {

      toast.warning(data.warningMessage)
      return
    }

    toast.success('Товар изменен!')

    return data
  }
)

export const AddBoilerPartsFx = createEffect(
  async ({ url, memory, price, proccesor, vendor_code, name, description, images, in_stock, bestseller, new_, popularity,  display, model, camera}: IBoilerPartAdd) => {
    const { data } = await api.post(url, { memory, price, proccesor, vendor_code, name, description, images, in_stock, bestseller, new_, popularity,  display, model, camera })

    if (data.warningMessage) {

      toast.warning(data.warningMessage)
      return
    }

    toast.success('Товар добавлен!')

    return data
  }
)

export const DeleteBoilerPartsFx = createEffect(
  async ({ url}: IBoilerPartDelete) => {
    const { data } = await api.delete(url)

    if (data.warningMessage) {

      toast.warning(data.warningMessage)
      return
    }

    toast.success('Товар удален!')

    return data
  }
)

export const getBoilerPartFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

export const searchPartsFx = createEffect(
  async ({ url, search }: { url: string; search: string }) => {
    const { data } = await api.post(url, { search })

    return data.rows
  }
)

export const getPartByNameFx = createEffect(
  async ({ url, name }: { url: string; name: string }) => {
    try {
      const { data } = await api.post(url, { name })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)
