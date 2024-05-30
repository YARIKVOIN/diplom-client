import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { IAtributesAdd, IAtributesDelete, IAtributesReplace } from '@/types/atributes'



export const getAtributesFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)
  return data
})

export const getAtributesIdFx = createEffect(async (url: string) => {
  const { data } = await api.post(url)
  return data
})


export const updateAtributesFx = createEffect(
  async ({ url, id, atributes }: IAtributesReplace) => {
    const { data } = await api.patch(url, { id, atributes })

    return data
  }
)

export const AddAtributesFx = createEffect(
  async ({ url, atributes }: IAtributesAdd) => {
    const { data } = await api.post(url, { atributes })


    return data
  }
)

export const DeleteAtributesFx = createEffect(
  async ({ url}: IAtributesDelete) => {
    const { data } = await api.delete(url)


    return data
  }
)

export const getAtributesbyIdStatusFx = createEffect(
  async ({ url, id}: { url: string; id: number;}) => {
    try {
      const { data } = await api.post(url, { id })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)