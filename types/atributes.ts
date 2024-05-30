import { FieldErrors, UseFormRegister } from "react-hook-form"

export interface IAtributes {
  id: number
  atributes: string
}

export interface IAtributesReplace {
  url: string
  id: number
  atributes: string
}
export interface IAtributesDelete {
  url: string
}
export interface IIAtributesDelete {
  id: number
}

export interface IIAtributesReplace {
  id: number
  atributes: string
}
export interface IIAtributesAdd{
  atributes: string
}

export interface IAtributesAdd{
  url: string
  atributes: string
}

export interface IAtributess {
  count: number
  rows: IAtributes[]
}

export interface IReplaceBoilerInput {
  register: UseFormRegister<IIAtributesReplace>
  errors: FieldErrors<IIAtributesReplace>
}