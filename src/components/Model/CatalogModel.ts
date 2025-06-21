import { IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";

interface ICatalogServer {
  total: number;
  items: IProduct[]
}

export class CatalogModel {
  private items: IProduct[];

  constructor(private events: EventEmitter, private api: Api) { }

  async fetchCatalog(): Promise<IProduct[]> {
    try {
      const data = await this.api.get(`/product`) as ICatalogServer;
      return data.items;
    } catch (error) {
      const message = error instanceof Error ? error.message : settings.ERRORS.UNKNOWN_ERROR;
      this.events.emit("catalog:items:error", { message });
      throw new Error(message);
    }
  }

  setItems(data: IProduct[]) {
    this.items = data;
    this.events.emit("catalog:items:update");
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: IProduct['id']): IProduct | undefined {
    if (Array.isArray(this.items))
      return this.items.find(item => item.id === id);
  }
}