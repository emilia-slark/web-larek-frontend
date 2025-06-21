import { IOrder, IOrderForm } from "../../types";
import { EMAIL_REGEX, settings } from "../../utils/constants";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";

type TFormErrors = Partial<Record<keyof IOrderForm, string>>;

type TOrderUpdatable = Pick<IOrder, 'payment' | 'email' | 'phone' | 'address' | "items" | "total">;

export class OrderModel {
  private order: Required<IOrder>;
  private validationErrors: TFormErrors = {};

  constructor(private events: EventEmitter, private api: Api) { }

  setOrderInfo(info: Partial<TOrderUpdatable>) {
    this.order = {
      ...this.order,
      ...info
    };

    if (info.address || info.payment) this.validateRegistration()
    if (info.email || info.phone) this.validateContacts()
  }

  validateRegistration(): boolean {
    const errors: typeof this.validationErrors = {};
    if (!this.order.address) errors.address = settings.ERRORS.VALIDATION.ADDRESS;
    if (!this.order.payment) errors.payment = settings.ERRORS.VALIDATION.PAYMENT;
    this.validationErrors = errors;
    this.events.emit('form:order:registration:validate', this.validationErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts(): boolean {
    const errors: typeof this.validationErrors = {};
    if (!this.order.email) errors.email = settings.ERRORS.VALIDATION.EMAIL;
    if (!EMAIL_REGEX.test(this.order.email)) errors.email = settings.ERRORS.VALIDATION.EMAIL_PATTERN;
    if (!this.order.phone) errors.phone = settings.ERRORS.VALIDATION.PHONE;
    this.validationErrors = errors;
    this.events.emit('form:order:contacts:validate', this.validationErrors);
    return Object.keys(errors).length === 0;
  }

  reset() {
    this.order = null;
  }

  async postOrder(): Promise<IOrder> {
    try {
      const data = await this.api.post(`/order`, this.order);
      return data as IOrder;
    } catch (error) {
      const message = error instanceof Error ? error.message : settings.ERRORS.UNKNOWN_ERROR;
      throw new Error(message);
    }
  }
}