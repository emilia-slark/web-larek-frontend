import { Component } from "./Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { settings } from "../../utils/constants";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsLabel: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(settings.FORM_SELECTOR.BUTTON_SUBMIT, this.container);
    this.errorsLabel = ensureElement<HTMLElement>(settings.FORM_SELECTOR.LABEL_ERRORS, this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit('form:order:change', {
      field,
      value,
    })
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this.errorsLabel, value);
  }

  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}