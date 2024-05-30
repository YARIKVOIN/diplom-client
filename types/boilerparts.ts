import { FieldErrors, UseFormRegister } from "react-hook-form"

export interface IBoilerPart {
  id: number
  memory: string
  price: number
  atributes: string
  vendor_code: string
  name: string
  description: string
  images: string
  in_stock: number
  bestseller: boolean
  new: boolean
  popularity: number
  model: string
}

export interface IBoilerPartReplace {
  url: string
  id: number
  memory: string
  price: number
  atributes: string
  vendor_code: string
  name: string
  description: string
  images: string
  in_stock: number
  bestseller: boolean
  new_: boolean
  popularity: number
  model: string
}
export interface IBoilerPartDelete {
  url: string
}
export interface IIBoilerPartDelete {
  id: number
}

export interface IIBoilerPartReplace {
  id: number
  memory: string
  price: number
  atributes: string
  vendor_code: string
  name: string
  description: string
  images: string
  in_stock: number
  bestseller: boolean
  new_: boolean
  popularity: number
  model: string
}
export interface IIBoilerPartAdd{
  memory: string
  price: number
  atributes: string
  vendor_code: string
  name: string
  description: string
  images: string
  in_stock: number
  bestseller: boolean
  new_: boolean
  popularity: number
  model: string
  znach: string
}

export interface IBoilerPartAdd{
  url: string
  memory: string
  price: number
  atributes: string
  vendor_code: string
  name: string
  description: string
  images: string
  in_stock: number
  bestseller: boolean
  new_: boolean
  popularity: number
  model: string
}

export interface IBoilerParts {
  count: number
  rows: IBoilerPart[]
}

export interface IReplaceBoilerInput {
  register: UseFormRegister<IIBoilerPartReplace>
  errors: FieldErrors<IIBoilerPartReplace>
}