import { ICategorys } from '@/types/category'
import { createDomain } from 'effector-next'

const Categorys = createDomain()

export const setCategorys = Categorys.createEvent<ICategorys>()

export const $Categorys = Categorys
  .createStore<ICategorys>({} as ICategorys)
  .on(setCategorys, (_, parts) => parts)