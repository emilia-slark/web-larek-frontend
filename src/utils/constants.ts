export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const EMAIL_REGEX: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i

export const settings = {
  BASKET_STORAGE_KEY: "basket_data",
  LABEL_PRICELESS: "Бесценно",
  LABEL_PRICE: "синапсов",
  LABEL_DEDUCTED: "Списано",
  LABEL_EMPTY: "Тут пока пусто...",
  LABEL_IN_BASKET: "В корзину",
  LABEL_IN_BASKET_DISABLED: "Слишком круто для корзины!",
  LABEL_OUT_BASKET: "Убрать с корзины",
  BUTTON_ACTIVE_SELECTOR: ".button_alt-active",
  CATEGORY_SELECTOR: {
    "софт-скил":      "card__category_soft",
    "хард-скил":      "card__category_hard",
    "кнопка":         "card__category_button",
    "дополнительное": "card__category_additional",
    "другое":         "card__category_other"
  },
  TEMPLATE_SELECTOR: {
    CARD_CATALOG: "#card-catalog",
    CARD_PREVIEW: "#card-preview",
    CARD_BASKET: "#card-basket",
    BASKET: "#basket",
    ORDER_FORM: "#order",
    CONTACTS_FORM: "#contacts",
    SUCCESS_ORDER: "#success"
  },
  PAGE_SELECTOR: {
    BASKET_BUTTON: ".header__basket",
    BASKET_COUNTER: ".header__basket-counter",
    CARDS_CONTAINER: "main.gallery",
    WRAPPER: ".page__wrapper",
    WRAPPER_LOCKED: ".page__wrapper_locked"
  },
  CARD_SELECTOR: {
    TITLE: ".card__title",
    PRICE: ".card__price",
    BUTTON: ".card__button",
    INDEX: ".basket__item-index",
    CATEGORY: ".card__category",
    IMAGE: ".card__image",
    DESCRIPTION: ".card__text"
  },
  FORM_SELECTOR: {
    LABEL_ERRORS: ".form__errors",
    BUTTON_SUBMIT: "button[type=submit]",
    CARD_BUTTON: "card",
    CASH_BUTTON: "cash"
  },
  MODAL_SELECTOR: {
    CONTAINER: "#modal-container",
    BUTTON_CLOSE: ".modal__close",
    CARDS_CONTAINER: ".modal__content",
    ACTIVE: ".modal_active"
  },
  BASKET_SELECTOR: {
    CARDS_CONTAINER: ".basket__list",
    BUTTON: ".basket__button",
    PRICE: ".basket__price"
  },
  ORDER_SUCCESS_SELECTOR: {
    BUTTON: ".order-success__close",
    DESCRIPTION: ".order-success__description"
  },
  ERRORS: {
    VALIDATION: {
      ADDRESS: "Укажите адрес доставки",
      PAYMENT: "Укажите способ оплаты",
      EMAIL: "Укажите Email",
      EMAIL_PATTERN: "Укажите корректный Email",
      PHONE: "Укажите телефон"
    },
    UNKNOWN_ERROR: "Неизвестная ошибка"
  }
}