import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { CatalogModel } from './components/Model/CatalogModel'
import { BasketModel } from './components/Model/BasketModel';
import { cloneTemplate, ensureElement, renderBasketItems } from './utils/utils';
import { CardCatalogView } from './components/View/CardCatalogView';
import { PageView } from './components/View/PageView';
import { Modal } from './components/common/Modal';
import { CardModalView } from './components/View/CardModalView';
import { IOrderForm, IProduct, IOrder } from './types';
import { BasketView } from './components/View/BasketView';
import { OrderModel } from './components/Model/OrderModel';
import { OrderRegistration } from './components/View/OrderRegistration';
import { OrderContacts } from './components/View/OrderContacts';
import { OrderSuccess } from './components/View/OrderSuccess';
import { settings } from './utils/constants';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.CARD_CATALOG);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.CARD_PREVIEW);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.CARD_BASKET);
const basketTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.BASKET);
const orderTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.ORDER_FORM);
const contactsTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.CONTACTS_FORM);
const successTemplate = ensureElement<HTMLTemplateElement>(settings.TEMPLATE_SELECTOR.SUCCESS_ORDER);

const api = new Api(API_URL);
const events = new EventEmitter();
const catalog = new CatalogModel(events, api);
const basket = new BasketModel(events);
const order = new OrderModel(events, api);

const pageView = new PageView(document.body, () => events.emit("basket:open"));
const modalView = new Modal(ensureElement<HTMLElement>(settings.MODAL_SELECTOR.CONTAINER), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), () => events.emit("order:registration"));
const orderView = new OrderRegistration(cloneTemplate(orderTemplate), events);
const contactsView = new OrderContacts(cloneTemplate(contactsTemplate), events);
const successView = new OrderSuccess(cloneTemplate(successTemplate), () => modalView.close())

// Загрузка корзины из локального хранилища
document.addEventListener("DOMContentLoaded", () => {
  basket.loadFromStorage();
});

// Прослушивание всех событий
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Отрисовка каталога на главной странице
events.on("catalog:items:update", () => {
  const cards = catalog.getItems()
    .map((item) => {
      const card = new CardCatalogView({
        container: cloneTemplate(cardCatalogTemplate),
        actions: { onClick: () => events.emit('catalog:items:select', item) }
      })
      return card.render({ ...item });
    })
  pageView.render({
    cards: cards,
  })
});

// Открытие модального окна с описанием товара
events.on("catalog:items:select", (item: IProduct) => {
  const isInBasket = basket.isInBasket(item.id);
  let card: CardModalView;
  card = new CardModalView({
    container: cloneTemplate(cardPreviewTemplate),
    actions: {
      onClick: () => {
        events.emit(
          !basket.isInBasket(item.id) ?
            `basket:items:add` :
            'basket:items:remove',
          { item, card });
      }
    }
  });
  card.isInBasket = isInBasket;
  card.isPriceless = item.price === null;
  modalView.render({ content: card.render({ ...item }) });
});

// Добавление товара в корзину
events.on("basket:items:add", ({ item, card }: { item: IProduct, card: CardModalView }) => {
  basket.addItem(item.id, item.price);
  card.isInBasket = true;
});

// Удаление товара из корзины
events.on("basket:items:remove", ({ item, card }: { item: IProduct, card: CardModalView }) => {
  basket.deleteItem(item.id);
  card.isInBasket = false;
});

// Отрисовка количества товаров корзины в шапке и содержимого корзины
events.on("basket:items:change", () => {
  pageView.render({ basketTotalAmount: basket.totalAmount })
  const basketItems = renderBasketItems(
    basket.getIdItems().map(id => catalog.getItem(id)),
    events,
    cardBasketTemplate);
  basketView.render({ basketTotalAmount: basket.totalPrice, items: basketItems })
});

// Открытие модального окна
events.on('modal:state:open', () => {
  pageView.locked = true;
});

// Закрытие модального окна
events.on('modal:state:close', () => {
  pageView.locked = false;
});

// Открытие корзины
events.on("basket:open", () => {
  const basketItems = renderBasketItems(
    basket.getIdItems().map(id => catalog.getItem(id)),
    events,
    cardBasketTemplate);
  modalView.render({
    content:
      basketView.render({
        basketTotalAmount: basket.totalPrice, items: basketItems
      })
  });
});

// Начало оформления заказа - показ модального окна с методом оплаты
events.on("order:registration", () => {
  order.setOrderInfo({ items: basket.getIdItems(), total: basket.totalPrice });
  modalView.render({
    content: orderView.render({
      address: "",
      valid: false,
      errors: []
    }),
  });
});

// Показ модального окна с контактными данными
events.on('order:submit', () => {
  modalView.render({
    content: contactsView.render({
      phone: "",
      email: "",
      valid: false,
      errors: []
    }
    ),
  });
})

// Показ успешно оформленного заказа
events.on('order:status:success', (result: IOrder) => {
  console.log(`Заказ ${result.id} оформлен успешно.`)
  modalView.render({
    content: successView.render({
      total: result.total
    })
  })
  basket.reset();
  order.reset();
  orderView.reset();
})

// Валидация формы с методом оплаты 
events.on('form:order:registration:validate', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  orderView.valid = !payment && !address;
  orderView.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Валидация формы с контактными данными 
events.on('form:order:contacts:validate', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contactsView.valid = !email && !phone;
  contactsView.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Заполнение данных текущего заказа
events.on('form:order:change', (data: { field: keyof IOrderForm, value: string }) => {
  order.setOrderInfo({ [data.field]: data.value });
});

// Отправление запроса с телом заказа
events.on('contacts:submit', () => {
  order.postOrder()
    .then(result => {
      events.emit("order:status:success", result);
    })
    .catch(error => console.error(error));
})

// Загрузка каталога с бекенда
catalog.fetchCatalog()
  .then(data => {
    catalog.setItems(
      data.map(item => ({
        ...item,
        image: CDN_URL + item.image.replace('.svg', '.png')
      }))
    );
  })
  .catch(error => console.error(error));