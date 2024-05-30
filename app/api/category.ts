import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { ICategoryAdd, ICategoryDelete, ICategoryReplace } from '@/types/category'



export const getCategoryFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)
  return data
})

export const getCategoryIdFx = createEffect(async (url: string) => {
  const { data } = await api.post(url)
  return data
})


export const updateCategoryFx = createEffect(
  async ({ url, id, category }: ICategoryReplace) => {
    const { data } = await api.patch(url, { id, category })

    return data
  }
)

export const AddCategoryFx = createEffect(
  async ({ url, category }: ICategoryAdd) => {
    const { data } = await api.post(url, { category })


    return data
  }
)

export const DeleteCategoryFx = createEffect(
  async ({ url}: ICategoryDelete) => {
    const { data } = await api.delete(url)


    return data
  }
)

export const getCategorybyIdStatusFx = createEffect(
  async ({ url, id}: { url: string; id: number;}) => {
    try {
      const { data } = await api.post(url, { id })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)