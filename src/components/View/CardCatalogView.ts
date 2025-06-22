import { ICardProps, TCategory } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "../common/Card";

export class CardCatalogView extends Card {
  protected elementCategory: HTMLElement;
  protected elementImage: HTMLImageElement;

  constructor(props: ICardProps) {
    super(props);

    this.elementCategory = ensureElement(settings.CARD_SELECTOR.CATEGORY, props.container);
    this.elementImage = ensureElement(settings.CARD_SELECTOR.IMAGE, props.container) as HTMLImageElement;
  }

  set category(value: TCategory) {
    this.setText(this.elementCategory, value);
    this.elementCategory.className = `card__category ${settings.CATEGORY_SELECTOR[value]}`;
  }

  set image(value: string) {
    this.elementImage.src = value;
    this.elementImage.alt = this.elementTitle.textContent;
  }
}