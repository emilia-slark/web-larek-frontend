import { IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { EventEmitter } from "../base/events";

export class BasketModel {
  private basket: Map<IProduct['id'], number> = new Map();;

  constructor(private events: EventEmitter) { }

  loadFromStorage() {
    const stored = localStorage.getItem(settings.BASKET_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Array<[string, number]>;
        this.basket = new Map(parsed);
        this.events.emit("basket:items:change");
      } catch (error) {
        console.error(error);
        this.basket = new Map();
      }
    }
  }

  private handleStorage() {
    const serialized = JSON.stringify(Array.from(this.basket.entries()));
    localStorage.setItem(settings.BASKET_STORAGE_KEY, serialized);
  }

  addItem(id: IProduct['id'], price: number) {
    this.basket.set(id, price);
    this.handleStorage();
    this.events.emit("basket:items:change");
  }

  deleteItem(id: IProduct['id']) {
    this.basket.delete(id);
    this.handleStorage();
    this.events.emit("basket:items:change");
  }

  getIdItems(): IProduct['id'][] {
    return [...this.basket.keys()]
  }

  isInBasket(id: IProduct['id']): boolean {
    return this.basket.has(id);
  }

  reset() {
    this.basket.clear();
    localStorage.removeItem(settings.BASKET_STORAGE_KEY);
    this.events.emit("basket:items:change");
  }

  get totalAmount() {
    return this.basket.size;
  }

  get totalPrice() {
    let sum = 0;
    for (const [_, value] of this.basket)
      sum += value;
    return sum;
  }
}