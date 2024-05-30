import { IProizvoditels } from '@/types/proizvoditel'
import { createDomain } from 'effector-next'

const proizvoditels = createDomain()

export const setProizvoditels = proizvoditels.createEvent<IProizvoditels>()

export const $proizvoditels = proizvoditels
  .createStore<IProizvoditels>({} as IProizvoditels)
  .on(setProizvoditels, (_, parts) => parts)