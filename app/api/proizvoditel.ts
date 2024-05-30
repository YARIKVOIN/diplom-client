import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { IProizvoditelAdd, IProizvoditelDelete, IProizvoditelReplace } from '@/types/proizvoditel'



export const getProizvoditelFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)
  return data
})

export const getProizvoditelIdFx = createEffect(async (url: string) => {
  const { data } = await api.post(url)
  return data
})


export const updateProizvoditelFx = createEffect(
  async ({ url, id, proizvoditel }: IProizvoditelReplace) => {
    const { data } = await api.patch(url, { id, proizvoditel })

    return data
  }
)

export const AddProizvoditelFx = createEffect(
  async ({ url, proizvoditel }: IProizvoditelAdd) => {
    const { data } = await api.post(url, { proizvoditel })


    return data
  }
)

export const DeleteProizvoditelFx = createEffect(
  async ({ url}: IProizvoditelDelete) => {
    const { data } = await api.delete(url)


    return data
  }
)

export const getProizvoditelbyIdStatusFx = createEffect(
  async ({ url, id}: { url: string; id: number;}) => {
    try {
      const { data } = await api.post(url, { id })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)