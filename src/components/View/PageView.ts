import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../common/Component";

interface IPageViewData {
  cards: HTMLElement[],
  basketTotalAmount: number;
}

export class PageView extends Component<IPageViewData> {
  protected basketButton: HTMLButtonElement;
  protected elementBasketCounter: HTMLElement;
  protected catalogContainer: HTMLElement;
  protected pageWrapper: HTMLElement;

  constructor(container: HTMLElement, onOpenBasket: () => void) {
    super(container);

    this.basketButton = ensureElement(settings.PAGE_SELECTOR.BASKET_BUTTON, this.container) as HTMLButtonElement;
    this.elementBasketCounter = ensureElement(settings.PAGE_SELECTOR.BASKET_COUNTER, this.basketButton);
    this.catalogContainer = ensureElement(settings.PAGE_SELECTOR.CARDS_CONTAINER, this.container);
    this.pageWrapper = ensureElement(settings.PAGE_SELECTOR.WRAPPER, this.container);

    this.basketButton.addEventListener('click', onOpenBasket);
  }

  set cards(items: HTMLElement[]) {
    this.catalogContainer.replaceChildren(...items);
  }

  set basketTotalAmount(value: number) {
    this.setText(this.elementBasketCounter, value);
  }

  set locked(value: boolean) {
    if (value) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      this.container.style.setProperty('--scroll-position', `${scrollY}px`);
      this.pageWrapper.classList.add(settings.PAGE_SELECTOR.WRAPPER_LOCKED.slice(1));
    } else {
      this.pageWrapper.classList.remove(settings.PAGE_SELECTOR.WRAPPER_LOCKED.slice(1));
      const scrollY = this.container.style.getPropertyValue('--scroll-position');
      this.container.style.removeProperty('--scroll-position');
      window.scrollTo(0, parseInt(scrollY || '0'));
    }
  }
}