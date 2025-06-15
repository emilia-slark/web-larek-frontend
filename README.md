# Проектная работа "Веб-ларек"

**Стек: HTML, SCSS, TS, Webpack**

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install     # установить пакеты зависимости
npm run start   # запустить в dev-режиме

npm run build   # запустить сборку проекта
```

## Проектирование

Проект выстроен по архитектурному паттерну **Model-View-Presenter (MVP)**, в котором бизнес-логика и данные отделены от пользовательского интерфейса. Использован событийно-ориентированный подход. Слой "Представитель" (Presenter) не вынесен в отдельный класс, но реализуется с помощью брокера событий напрямую в файле `src/index.ts`, где связываются модели и отображения, обрабатываются события и происходит маршрутизация пользовательских действий.

### БАЗОВЫЕ классы

#### 1. Класс работы с API - `class Api`

Класс содержит набор методов работы с API сервера.

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`()`|конструктор|
|`#options`|`RequestInit`|параметры запросов|
|`+baseUrl`|`string`|базовый URL|
|`#handleResponse`|`(response: Response): Promise<object>`|метод обработки ответа сервера|
|`get`|`(uri: string): Promise<object>`|`GET`-запрос|
|`post`|`(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`|`POST`-запрос|

#### 2. Класс брокера событий - `class EventEmitter`

Класс обеспечивает работу событий, позволяющий различным сущностям обмениваться "сообщениями" без жёсткой связности.

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`()`|конструктор|
|`#_events`|`Map<EventName, Set<Subscriber>>`|события|
|`+on`|`<T extends object>(eventName: EventName, callback: (event: T) => void) `|метод подписки на событие|
|`+off`|`(eventName: EventName, callback: Subscriber)`|снятие обработчика с события|
|`+emit`|`<T extends object>(eventName: string, data?: T)`|инициация события с данными|

#### 3. Общий класс для компонентов отображения - `abstract class Component<T>`

Класс содержит методы работы с DOM-элементами, позволяя отображать то, что пришло в аргумент метода `render(data)`, но в дочерних компонентах необходимо установить сеттеры исходя из обобщенного типа `T`. Все динамические компоненты отображения на странице унаследуют данный класс.

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(#container: HTMLElement)`|конструктор|
|`+toggleClass`|`(element: HTMLElement, className: string, force?: boolean)`|Переключить класс|
|`#setText`|`(element: HTMLElement, className: string, force?: boolean)`|установить текстовое содержимое|
|`+setDisabled`|`(element: HTMLElement, state: boolean)`|сменить статус блокировки|
|`#setHidden`|`(element: HTMLElement)`|скрыть DOM-элемент|
|`#setVisible`|`(element: HTMLElement)`|показать DOM-элемент|
|`#setImage`|`(element: HTMLImageElement, src: string, alt?: string)`|установить изображение с алтернативным текстом|
|`+render`|`(data?: Partial<T>): HTMLElement`|вернуть корневой DOM-элемент|

#### 4. Компонент модального окна - `class Modal extends Component<IModalData>`

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(#container: HTMLElement, events: EventEmitter)`|конструктор|
|`set content`|`(value: HTMLElement)`|сеттер для отображения содержимого окна|
|`+open`|`()`|открыть модальное окно|
|`+close`|`()`|закрыть модальное окно|

#### 4.1 Входные данные для модального окна - `interface IModalData`

|Название|Тип|Описание|
|-|--------|---|
|`content`|`HTMLElement`|содержимое модального окна|


#### 5. Компонент формы - `class Form<T> extends Component<IFormData>`

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(#container: HTMLFormElement, events: EventEmitter)`|конструктор|
|`#onInputChange`|`(field: keyof T, value: string)`|обработчик события ввода информации пользователем в формах|
|`set errors`|`(value: string[]) `|сеттер для текста ошибки|
|`set valid`|`(value: boolean)`|сеттер для валидности формы|

#### 5.1 Входные данные для формы - `interface IFormData`
|Название|Тип|Описание|
|-|--------|---|
|`valid`|`boolean`|валидность формы|
|`errors`|`string[]`|текст ошибки|

---

### Уровень МОДЕЛИ данных

#### 1. Структура товара - `interface IProduct`

|Название|Тип|Описание|
|-|--------|---|
|`id`|`string`|идентификатор|
|`description`|`string`|описание|
|`image`|`string`|URL картинки|
|`title`|`string`|название|
|`category`|`Category`|категория|
|`price`|`number`|цена|

#### 1.1 Категории товаров - `enum Category`

|Название|Значение|
|-|--------|
|`softskill`|`"софт-скил"`|
|`hardskill`|`"хард-скил"`|
|`button`|`"кнопка"`|
|`additional`|`"дополнительное"`|
|`other`|`"другое"`|

#### 2. Модель работы каталога - `class CatalogModel`

Класс описывает основную логику работы каталога на уровне модели данных. На вход принимает брокер событий для генерации соответствующих событий для рендера и экземпляр класса API. Решено не выносить в отдельную сущность класс работы с API Web-Ларька, поскольку в данном проекте всего два случая общения с бекендом: запрос каталога при отрисовке страницы и оформление заказа; определены такие API методы в соответствующих им классах (`CatalogModel` - `fetchCatalog()`, `Order` - `postOrder()`). Сам класс хранит массив товаров из каталога и реализовывает базовые методы работы с ним.

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(events: EventEmitter, api: Api)`|конструктор|
|`-events`|`EventEmitter`|для генерации событий|
|`-api`|`Api`|для работы с сервером|
|`-items`|`IProduct[]`|товары каталога|
|`+fetchCatalog`|`(): Promise<void>`|загрузить каталог товаров|
|`+setItems`|`(data: IProduct[]): void`|метод присвоения товаров|
|`+getItems`|`(): IProduct[]`|вернуть все товары|
|`+getItem`|`(id: IProduct['id']): IProduct \| undefined`|вернуть конкретный товар|

> Тип `IProduct['id']` выбран для того, чтобы перестраховаться в случае изменения типа `id: string`, например, на `id: number`

#### 3. Модель работы корзины - `class BasketModel`

Класс описывает основную логику работы корзины на уровне модели данных. На вход принимает брокер событий для генерации соответствующих событий для рендера. Пользователь может добавлять и удалять товары из корзины. Также определены методы : `get totalAmount()` для вывода количества товаров в шапке главной страницы, `getItemsId()` и `get totalPrice()` для передачи списка `id` товаров и итоговой стоимости в заказ `Order`.

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(events: EventEmitter)`|конструктор|
|`-events`|`EventEmitter`|для обработки событий|
|`-basket`|`items: IProduct['id'][]`|товары в корзине|
|`+addItem`|`(id: IProduct['id']): void`|добавить товар|
|`+deleteItem`|`(id: IProduct['id']): void`|удалить товар|
|`+getOrderItems`|`(): IProduct['id'][]`|вернуть все `id` товаров в корзине|
|`+get totalAmount`|`number`|вернуть количество товаров в корзине|
|`+get totalPrice`|`number`|вернуть итоговую стоимость|

#### 3.1 Тип товаров в корзине - 
```
type TBasketItem = Partial<IProduct> & { id: IProduct['id'] }
```

#### 4. Структура заказа - `type TOrder`

|Название|Тип|Описание|
|-|--------|---|
|`id?`|`string`|идентификатор|
|`payment`|`TPaymentMethod`|метод оплаты|
|`email`|`string`|электронная почта|
|`phone`|`string`|номер телефона|
|`address`|`string`|адрес|
|`total`|`number`|итоговая стоимость|
|`items`|`IProduct['id'][]`|список покупаемых товаров|

> `id` будет присваиваться после успешного запроса на сервер

#### 4.1 Способы оплаты заказа - 
```
type TPaymentMethod = "online" | "cash"
```

#### 5. Модель обработки заказа - `class OrderModel`

Класс описывает основную логику формирования заказа на уровне модели данных. На вход принимает брокер событий для генерации соответствующих событий для рендера, экземпляр класса API и объект, содержащий покупаемые товары и их итоговую стоимость. По мере заполнения формы оформления заказа заполняются соответствующие поля заказа (метод оплаты, адрес и т.д.)

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(events: EventEmitter, api: Api, items: IProduct['id'][], price: number)`|конструктор|
|`-events`|`EventEmitter`|для обработки событий|
|`-api`|`Api`|для работы с сервером|
|`-order`|`Partial<TOrder>`|заказ|
|`+setOrderInfo`|`(info: Partial<TOrderUpdatable>): void`|обновление информации о заказе|
|`+postOrder`|`(): Promise<TOrder>`|сделать заказ|

> Метод `setOrderInfo(info)` позволяет обновить информацию о текущем заказе, например, только телефон - `setOrderInfo({ phone: "000" })`, или эл. почту с адресом доставки -  `setOrderInfo({ email: "000@aaa.ru", address: "г. Калининград..." })`, перезаписывая свойства `this.order`. Тип аргумента не позволит перезаписать другие свойства.

#### 5.1 Тип полей заказа из форм -
```
type TOrderUpdatable = Pick<TOrder, 'payment' | 'email' | 'phone' | 'address'>
```

---

### Компоненты ОТОБРАЖЕНИЯ

#### 1. Элемент каталога на главной странице - `class PageView extends Component<IPageViewData>`

Компонент представления главной страницы, отвечающий за взаимодействие пользователя с элементами интерфейса (корзина) и их динамическое обновление (счетчик товаров, каталог).

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(container: HTMLElement, events: EventEmitter)`|конструктор|
|`#elementBasket`|`HTMLButtonElement`|элемент в DOM, содержащий кнопку корзины|
|`#elementBasketCounter`|`HTMLElement`|элемент в DOM, содержащий количество товаров в корзине|
|`#catalogContainer`|`HTMLElement`|контейнер для рендеринга каталога товаров|
|`#onClick`|`(): void`|для создания событий на корзину по клику|
|`set cards`|`(value: HTMLElement[])`|сеттер контейнера с каталогом|
|`set basketTotalAmount`|`(value: number)`|сеттер контейнера с каталогом|

#### 1.1 Входные данные для главной страницы - `interface IPageViewData`

|Название|Тип|Описание|
|-|--------|---|
|`cards`|`HTMLElement[]`|каталог товаров|
|`basketTotalAmount`|`number`|количество товаров в корзине|

#### 2. Элемент каталога на главной странице - `class Card extends Component<IProduct>`

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(container: HTMLElement, events: EventEmitter, handleClick?: (event: MouseEvent) => void)`|конструктор|
|`-elementId`|`IProduct['id']`|идентификатор|
|`#elementCategory`|`HTMLElement`|элемент в DOM, содержащий категорию карточки товара|
|`#elementTitle`|`HTMLElement`|название|
|`#elementImage`|`HTMLElement`|картинка|
|`#elementPrice`|`HTMLElement`|цена|
|`#elementButton`|`HTMLButtonElement`|кнопка для открытия модального окна|
|`set category`|`(value: string)`|сеттер категории в карточке товара|
|`set title`|`(value: string)`|сеттер названия в карточке|
|`set image`|`(value: string)`|сеттер картинки в карточке|
|`set price`|`(value: number)`|сеттер цены в карточке|
|`set id`|`(value: IProduct['id']):`|сеттер `id` карточки|
|`get id`|`(): IProduct['id']`|геттер `id` карточки|

#### 3. Корзина - `class BasketView extends Component<IBasketViewData>`

#### 3.1 Входные данные для корзины - `interface IBasketViewData`

|Название|Тип|Описание|
|-|--------|---|
|`items`|`HTMLElement[]`|карточки товаров в корзине|
|`basketTotalAmount`|`number`|итоговая стоимость заказа| 

#### 4 Форма регистрации заказа - `class OrderRegistration extends Form<IOrderRegistration>`

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(container: HTMLElement, events: EventEmitter)`|конструктор|

#### 4.1 Входные данные для корзины - `interface IOrderRegistration`

|Название|Тип|Описание|
|-|--------|---|
|`payment`|`TPaymentMethod`|метод оплаты|
|`address`|`string`|адрес доставки| 

#### 5 Форма регистрации заказа - `class OrderContacts extends Form<IOrderContacts>`

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(container: HTMLElement, events: EventEmitter)`|конструктор|

#### 5.1 Входные данные для корзины - `interface IOrderContacts`

|Название|Тип|Описание|
|-|--------|---|
|`email`|`string`|эл. почта|
|`phone`|`string`|номер телефона| 

#### 6 Компонент отображения успешного заказа - `class OrderSuccess extends Component<IOrderSuccessData>`

|Название|Тип|Описание|
|-|--------|---|
|`constructor`|`(container: HTMLElement, events: EventEmitter)`|конструктор|

#### 6.1 Входные данные для корзины - `interface IOrderSuccessData`

|Название|Тип|Описание|
|-|--------|---|
|`total`|`number`|итоговая стоимость заказа|

---

### Описание событий:

|Название|Триггер|Реакция|
|-|--------|---|
|`catalog:items:update`|обновление каталога товаров на уровне модели данных|отрисовка каталога|
|`catalog:items:select`|нажатие на карточку товара из каталога|открытие модального окна с описанием товара|
|`basket:items:add`|нажатие кнопки "В корзину" на карточке товара|добавление товара в корзину на уровне модели данных, отрисовка количества товаров корзины в шапке|
|`basket:open`|нажатие кнопки "корзина" в шапке|открытие модального окна c содержимым корзины|
|`basket:items:remove`|нажатие кнопки "удалить товар" в корзине|удаление товара из корзины на уровне модели, отрисовка содержимого корзины|
|`basket:items:change`|любое изменение содержимого корзины|-|
|`order:registration`|нажатие кнопки "Оформить" в корзине|открытие модального окна c выбором метода оплаты и вводом адреса доставки, добавление товаров из корзины в текущий заказ на уровне модели данных|
|`order:contacts`|нажатие кнопки "Далее" в модальном окне с выбором метода оплаты|открытие модального окна с вводом эл. почты и номера телефона|
|`order:post`|нажатие кнопки "Оплатить" в модальном окне с вводом эл. почты и номера телефона|отправка `post` запроса с телом заказа на бекенд на уровне модели данных|
|`order:status:success`|получение успешного ответа с бекенда|открытие модального окна со статусом оформления заказа, отрисовка итоговой стоимости в этом окне|
|`form:order:change`|ввод данных пользователем в форму|валидация полей|
|`form:order:registration:validate:error`|завершение валидации формы|получение ошибки|
|`form:order:contacts:validate:error`|завершение валидации формы|получение ошибки|
|`modal:state:open`|открытие модального окна|выставление запрета скролла страницы|
|`modal:state:close`|закрытие модального окна|снятие запрета скролла страницы|
