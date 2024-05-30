import { FieldErrors, UseFormRegister } from "react-hook-form"
import { ICatalogFilterDesktopProps, ICatalogFilterMobileProps } from './catalog';
import { init } from "@emailjs/browser";

export interface IProizvoditel {
  id: number
  proizvoditel: string
}

export interface IProizvoditelReplace {
  url: string
  id: number
  proizvoditel: string
}
export interface IProizvoditelDelete {
  url: string
}
export interface IIProizvoditelDelete {
  id: number
}

export interface IIProizvoditelReplace {
  id: number
  proizvoditel: string
}
export interface IIProizvoditelAdd{
  proizvoditel: string
}

export interface IProizvoditelAdd{
  url: string
  proizvoditel: string
}

export interface IProizvoditels {
  count: number
  rows: IProizvoditel[]
}

export interface IReplaceBoilerInput {
  register: UseFormRegister<IIProizvoditelReplace>
  errors: FieldErrors<IIProizvoditelReplace>
}