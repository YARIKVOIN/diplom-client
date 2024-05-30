
import { IAtributes } from '@/types/atributes'
import { createDomain } from 'effector-next'

const atributes = createDomain()

export const setAtributes= atributes.createEvent<IAtributes>()

export const $atributes = atributes
  .createStore<IAtributes>({} as IAtributes)
  .on(setAtributes, (_, part) => part)
