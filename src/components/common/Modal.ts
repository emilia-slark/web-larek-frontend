import { Component } from "./Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { settings } from "../../utils/constants";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(settings.MODAL_SELECTOR.BUTTON_CLOSE, container);
    this.contentContainer = ensureElement<HTMLElement>(settings.MODAL_SELECTOR.CARDS_CONTAINER, container);

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('mousedown', this.close.bind(this));
    this.contentContainer.addEventListener('mousedown', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open() {
    this.container.classList.add(settings.MODAL_SELECTOR.ACTIVE.slice(1));
    this.events.emit('modal:state:open');
  }

  close() {
    this.container.classList.remove(settings.MODAL_SELECTOR.ACTIVE.slice(1));
    this.content = null;
    this.events.emit('modal:state:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}