import { IEvents } from "../base/events";
import { Form } from "../common/Form";

interface IOrderContacts {
  email: string;
  phone: string;
}

export class OrderContacts extends Form<IOrderContacts> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}