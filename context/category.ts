
import { ICategory } from '@/types/category'
import { createDomain } from 'effector-next'

const category = createDomain()

export const setCategory = category.createEvent<ICategory>()

export const $category = category
  .createStore<ICategory>({} as ICategory)
  .on(setCategory, (_, part) => part)
