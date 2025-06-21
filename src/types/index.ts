import { settings } from "../utils/constants";

export interface IProduct {
  id: string,
  description: string,
  image: string,
  title: string,
  category: TCategory,
  price: number | null
}

export type TCategory = keyof typeof settings.CATEGORY_SELECTOR

export interface IOrder {
  id?: string,
  payment: TPaymentMethod,
  email: string,
  phone: string,
  address: string,
  total: number,
  items: IProduct['id'][]
}

export type TPaymentMethod = "online" | "cash"

export interface IOrderForm {
  payment: TPaymentMethod;
  address: string;
  email: string;
  phone: string;
}

interface ICardActions {
  onClick: (event: MouseEvent) => void
}

export interface ICardProps {
  container: HTMLElement,
  actions?: ICardActions
}