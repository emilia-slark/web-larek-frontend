import { ICardProps, IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";

export class Card extends Component<IProduct> {
  protected elementTitle: HTMLElement;
  protected elementPrice: HTMLElement;
  protected elementButton: HTMLButtonElement;

  constructor(props: ICardProps) {
    super(props.container);

    this.elementTitle = ensureElement(settings.CARD_SELECTOR.TITLE, props.container);
    this.elementPrice = ensureElement(settings.CARD_SELECTOR.PRICE, props.container);
    this.elementButton = props.container.querySelector(settings.CARD_SELECTOR.BUTTON);

    if (props.actions?.onClick) {
      if (this.elementButton) this.elementButton.addEventListener('click', props.actions.onClick); else props.container.addEventListener('click', props.actions.onClick);
    }
  }

  set title(value: string) {
    this.setText(this.elementTitle, value);
  }

  set price(value: number) {
    this.setText(this.elementPrice, value ? `${value} ${settings.LABEL_PRICE}` : settings.LABEL_PRICELESS);
  }
}