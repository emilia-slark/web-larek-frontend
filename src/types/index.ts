export interface IProduct {
  id: string,
  description: string,
  image: string,
  title: string,
  category: Category,
  price: number
}

export enum Category {
  softskill = "софт-скил",
  hardskill = "хард-скил",
  button = "кнопка",
  additional = "дополнительное",
  other = "другое",
}

export type TBasketItem = Partial<IProduct> & { id: IProduct['id'] }

export interface TOrder {
  id?: string,
  payment: TPaymentMethod,
  email: string,
  phone: string,
  address: string,
  total: number,
  items: IProduct['id'][]
}

type TPaymentMethod = "online" | "cash"

export type TOrderUpdatable = Pick<TOrder, 'payment' | 'email' | 'phone' | 'address'>;

//////////////////////////////////////////////////////////////

export interface IPageViewData {
  cards: HTMLElement[],
  basketTotalAmount: number;
}

export interface IModalData {
  content: HTMLElement
}

export interface IFormData {
  valid: boolean,
  error: string[]
}

export interface IBasketViewData {
  items: HTMLElement[];
  basketTotalAmount: number;
}

export interface IOrderRegistration {
  payment: TPaymentMethod,
  address: string
}

export interface IOrderContacts {
  email: string,
  phone: string
}

export interface IOrderSuccessData {
  total: number
}