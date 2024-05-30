import { FieldErrors, UseFormRegister } from "react-hook-form"

export interface ICategory {
  id: number
  category: string
}

export interface IIICategory {
  category: string
}

export interface ICategoryReplace {
  url: string
  id: number
  category: string
}
export interface ICategoryDelete {
  url: string
}
export interface IICategoryDelete {
  id: number
}

export interface IICategoryReplace {
  id: number
  category: string
}
export interface IICategoryAdd{
  category: string
}

export interface ICategoryAdd{
  url: string
  category: string
}

export interface ICategorys {
  count: number
  rows: ICategory[]
}

export interface IReplaceBoilerInput {
  register: UseFormRegister<IICategoryReplace>
  errors: FieldErrors<IICategoryReplace>
}