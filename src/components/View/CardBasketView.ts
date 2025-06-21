import { ICardProps, IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "../common/Card";

export class CardBasketView extends Card {
  protected indexElement: HTMLElement;

  constructor(props: ICardProps) {
    super(props);

    this.indexElement = ensureElement(settings.CARD_SELECTOR.INDEX, this.container);
  }

  set index(value: number) {
    this.setText(this.indexElement, value);
  }
}