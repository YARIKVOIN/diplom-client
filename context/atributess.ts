import { IAtributess } from '@/types/atributes'
import { createDomain } from 'effector-next'

const atributess = createDomain()

export const setAtributess = atributess.createEvent<IAtributess>()

export const $atributess = atributess
  .createStore<IAtributess>({} as IAtributess)
  .on(setAtributess, (_, parts) => parts)