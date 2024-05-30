import { IProizvoditel } from '@/types/proizvoditel'
import { createDomain } from 'effector-next'

const proizvoditel = createDomain()

export const setProizvoditel = proizvoditel.createEvent<IProizvoditel>()

export const $orderReal = proizvoditel
  .createStore<IProizvoditel>({} as IProizvoditel)
  .on(setProizvoditel, (_, part) => part)
