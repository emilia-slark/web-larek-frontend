import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../common/Component";

interface IBasketViewData {
  items: HTMLElement[] | string;
  basketTotalAmount: number;
}

export class BasketView extends Component<IBasketViewData> {
  protected cardsContainer: HTMLUListElement;
  protected orderButton: HTMLButtonElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, onOrder: () => void) {
    super(container);

    this.cardsContainer = ensureElement(settings.BASKET_SELECTOR.CARDS_CONTAINER, this.container) as HTMLUListElement;
    this.orderButton = ensureElement(settings.BASKET_SELECTOR.BUTTON, this.container) as HTMLButtonElement;
    this.priceElement = ensureElement(settings.BASKET_SELECTOR.PRICE, this.container);

    this.orderButton.addEventListener('click', onOrder);
  }

  set basketTotalAmount(value: number) {
    this.setText(this.priceElement, `${value} ${settings.LABEL_PRICE}`);
  }

  set items(value: HTMLElement[]) {
    this.setDisabled(this.orderButton, !value.length);
    if (!value.length)
      this.setText(this.priceElement, settings.LABEL_EMPTY);
    this.cardsContainer.replaceChildren(...value);
  }
}