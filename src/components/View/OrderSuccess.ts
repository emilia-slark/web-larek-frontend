import { settings } from "../../utils/constants";
import { Component } from "../common/Component";

interface IOrderSuccessData {
  total: number
}

export class OrderSuccess extends Component<IOrderSuccessData> {
  protected elementButton: HTMLButtonElement;
  protected elementDescription: HTMLElement;

  constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void) {
    super(container);

    this.elementButton = container.querySelector(settings.ORDER_SUCCESS_SELECTOR.BUTTON);
    this.elementDescription = container.querySelector(settings.ORDER_SUCCESS_SELECTOR.DESCRIPTION);

    this.elementButton.addEventListener('click', onClick);
  }

  set total(value: number) {
    this.setText(this.elementDescription, `${settings.LABEL_DEDUCTED} ${value} ${settings.LABEL_PRICE}`);
  }
}