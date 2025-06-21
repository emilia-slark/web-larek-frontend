import { TPaymentMethod } from "../../types";
import { settings } from "../../utils/constants";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";

interface IOrderRegistration {
  payment: TPaymentMethod,
  address: string
}

export class OrderRegistration extends Form<IOrderRegistration> {
  protected elementCard: HTMLButtonElement;
  protected elementCash: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.elementCard = container.elements.namedItem(settings.FORM_SELECTOR.CARD_BUTTON) as HTMLButtonElement;
    this.elementCash = container.elements.namedItem(settings.FORM_SELECTOR.CASH_BUTTON) as HTMLButtonElement;

    this.elementCard.addEventListener('click', () => {
      this.elementCard.classList.add(settings.BUTTON_ACTIVE_SELECTOR.slice(1));
      this.elementCash.classList.remove(settings.BUTTON_ACTIVE_SELECTOR.slice(1));
      this.onInputChange('payment', 'online')
    })

    this.elementCash.addEventListener('click', () => {
      this.elementCash.classList.add(settings.BUTTON_ACTIVE_SELECTOR.slice(1))
      this.elementCard.classList.remove(settings.BUTTON_ACTIVE_SELECTOR.slice(1))
      this.onInputChange('payment', 'cash')
    })

  }

  reset() {
    this.elementCash.classList.remove(settings.BUTTON_ACTIVE_SELECTOR.slice(1));
    this.elementCard.classList.remove(settings.BUTTON_ACTIVE_SELECTOR.slice(1));
  }
}