import { NextRouter } from 'next/router'
import { getQueryParamOnFirstRender, idGenerator } from './common'
import { getBoilerPartsFx } from '@/app/api/boilerParts'
import { setFilteredBoilerParts } from '@/context/boilerParts'
import { useStore } from 'effector-react'
import { $proizvoditels, setProizvoditels } from '@/context/proizvoditels'
import { useEffect, useState } from 'react'
import { getProizvoditelFx } from '@/app/api/proizvoditel'
import { toast } from 'react-toastify'
import { IProizvoditel, IProizvoditels } from '@/types/proizvoditel'
import { getCategoryFx } from '@/app/api/category'
import { ICategory } from '@/types/category'
import { IFilterCheckboxItem } from '@/types/catalog'

const createManufacturerCheckboxObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
})


// export const boilerManufacturers = async () => { 
//   var data = await getProizvoditelFx('/proizvoditel');
//   console.log(data.map(createManufacturerCheckboxObj))
//   return data.map(createManufacturerCheckboxObj)
// }
// console.log(boilerManufacturers())
// export const partsManufacturers = async () => { 
//   var {data} = await getCategoryFx('/category');
//     var partsManufacturers2 = data.map((item: ICategory) => (item.category)); 
//     partsManufacturers2 = partsManufacturers2.map(createManufacturerCheckboxObj)
//     return partsManufacturers2
// }

export const boilerManufacturers = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'Lenovo',
  'Asus',
  'LG',
  'Borch',
  'Nvidia',
  'AMD',
  'Philips',
  'Razer',
  'Sony',
  'Logitech',
  'Canon',
  'Sven',
  'Dyson',
].map(createManufacturerCheckboxObj)


export const partsManufacturers = [
  'Телефон',
  'Ноутбук',
  'Планшет',
  'Телевизор',
  'Монитор',
  'Системный блок',
  'Видеокарта',
  'Видеокамера',
  'Клавиатура',
  'Мышка',
  'Наушники',
  'Микроволновка',
  'Стиральная машина',
  'Кофеварка',
  'Фен',
  'Пылесос',
  'Холодильник',
].map(createManufacturerCheckboxObj)

const checkPriceFromQuery = (price: number) =>
  price && !isNaN(price) && price >= 0 && price <= 1000000

export const checkQueryParams = (router: NextRouter) => {
  const priceFromQueryValue = getQueryParamOnFirstRender(
    'priceFrom',
    router
  ) as string
  const priceToQueryValue = getQueryParamOnFirstRender(
    'priceTo',
    router
  ) as string
  const boilerQueryValue = JSON.parse(
    decodeURIComponent(getQueryParamOnFirstRender('boiler', router) as string)
  )
  const partsQueryValue = JSON.parse(
    decodeURIComponent(getQueryParamOnFirstRender('parts', router) as string)
  )
  const isValidBoilerQuery =
    Array.isArray(boilerQueryValue) && !!boilerQueryValue?.length
  const isValidPartsQuery =
    Array.isArray(partsQueryValue) && !!partsQueryValue?.length
  const isValidPriceQuery =
    checkPriceFromQuery(+priceFromQueryValue) &&
    checkPriceFromQuery(+priceToQueryValue)

  return {
    isValidBoilerQuery,
    isValidPartsQuery,
    isValidPriceQuery,
    priceFromQueryValue,
    priceToQueryValue,
    boilerQueryValue,
    partsQueryValue,
  }
}

export const updateParamsAndFiltersFromQuery = async (
  callback: VoidFunction,
  path: string
) => {
  callback()

  const data = await getBoilerPartsFx(`/boiler-parts?limit=20&offset=${path}`)

  setFilteredBoilerParts(data)
}

export async function updateParamsAndFilters<T>(
  updatedParams: T,
  path: string,
  router: NextRouter
) {
  const params = router.query
  console.log(params, "1")
  delete params.boiler
  delete params.parts
  delete params.priceFrom
  delete params.priceTo

  router.push(
    {
      query: {
        ...params,
        ...updatedParams,
      },
    },
    undefined,
    { shallow: true }
  )

  const data = await getBoilerPartsFx(`/boiler-parts?limit=20&offset=${path}`)
  console.log(data);
  setFilteredBoilerParts(data)
}
