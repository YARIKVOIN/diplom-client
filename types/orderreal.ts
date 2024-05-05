import { FieldErrors, UseFormRegister } from "react-hook-form"

export interface IOrderReal {
  id: number
  orderlist: string
  fullprice: number
  login: string
  email: string
  status: string
}

export interface IOrderRealReplace {
  url: string
  id: number
  orderlist: string
  fullprice: number
  login: string
  email: string
  status: string
}
export interface IOrderRealDelete {
  url: string
}
export interface IIOrderRealDelete {
  id: number
}

export interface IIOrderRealReplace {
  id: number
  orderlist: string
  fullprice: number
  login: string
  email: string
  status: string
}
export interface IIOrderRealAdd{
  orderlist: string
  fullprice: number
  login: string
  email: string
  status: string
}

export interface IOrderRealAdd{
  url: string
  orderlist: string
  fullprice: number
  login: string
  email: string
  status: string
}

export interface IOrderReals {
  count: number
  rows: IOrderReal[]
}

export interface IReplaceBoilerInput {
  register: UseFormRegister<IIOrderRealReplace>
  errors: FieldErrors<IIOrderRealReplace>
}