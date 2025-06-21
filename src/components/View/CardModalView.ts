import { ICardProps } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { CardCatalogView } from "./CardCatalogView";

export class CardModalView extends CardCatalogView {
  protected elementDescription: HTMLElement;

  constructor(props: ICardProps) {
    super(props);

    this.elementDescription = ensureElement(settings.CARD_SELECTOR.DESCRIPTION, this.container);
  }

  set description(value: string) {
    this.elementDescription.textContent = value;
  }

  set isInBasket(value: boolean) {
    this.setText(this.elementButton, !value ? settings.LABEL_IN_BASKET : settings.LABEL_OUT_BASKET);
  }

  set isPriceless(value: boolean) {
    this.setDisabled(this.elementButton, value);
    if (value) this.setText(this.elementButton, settings.LABEL_IN_BASKET_DISABLED);
  }
}