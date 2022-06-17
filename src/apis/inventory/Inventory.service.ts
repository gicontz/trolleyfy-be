import { injectable, inject } from 'inversify';

import NotFoundError from '@errors/NotFoundError';

import {
  INVENTORY_TYPES,
  IInventoryService,
  IInventoryDao,
} from './Inventory.ioc';

import {
  ORDER_TYPES,
  IOrderService,
} from '@apis/order/Order.ioc';

import {
  TCreateItemData,
  TGetItemData,
  TGetItemListData,
  TUpdateItemData,
  TDeleteItemData,
  TMultipleDeleteItemData,
} from './Inventory.data';
import ConflictError from '@errors/ConflictError';
import BadRequestError from '@errors/BadRequestError';

@injectable()
export default class InventoryService implements IInventoryService {
  private inventoryDao: IInventoryDao;
  private orderService: IOrderService;

  constructor(@inject(INVENTORY_TYPES.iInventoryDao) inventoryDao: IInventoryDao, @inject(ORDER_TYPES.iOrderService) orderService: IOrderService) {
    this.inventoryDao = inventoryDao;
    this.orderService = orderService;
  }

  public createItem = async (data: TCreateItemData) => {
    const existingItems = await this.inventoryDao.getItemList({});
    const nameCount = existingItems.filter(({ name }) => name === data.name).length;
    const prodCodeCnt = existingItems.filter(({ productCode }) => productCode === data.productCode).length;

    if (nameCount > 0) {
      throw new ConflictError('Product name already exists');
    }

    if (prodCodeCnt > 0) {
      throw new ConflictError('Product code already exists');
    }

    const item = await this.inventoryDao.createItem(data);
    return item;
  };

  public getItem = async (data: TGetItemData) => {
    const { itemId, productCode } = data;
    if (!itemId && !productCode) {
      throw new BadRequestError('No itemId nor productCode provided');
    }

    if (itemId) {
      const item = await this.inventoryDao.getItem({itemId});
      if (item == null) {
        throw new NotFoundError('Item data not found.');
      }
      return item;
    }

    const item = await this.inventoryDao.getItem({productCode});
    if (item == null) {
      throw new NotFoundError('Item data not found.');
    }
    return item;

  };

  public getItemList = async (data: TGetItemListData) => {
    const { ids } = data;
    if (ids) {
      const itemList = await this.inventoryDao.getItemList(data);
      return itemList;
    }
    const itemList = await this.inventoryDao.getItemList(data);
    return itemList;
  };

  public updateItem = async (data: TUpdateItemData) => {
    const { itemId } = data;

    const item = await this.inventoryDao.getItem({ itemId });
    if (item == null) {
      throw new NotFoundError('Item data not found.');
    }

    await this.inventoryDao.updateItem(data);
  };

  public deleteItem = async (data: TDeleteItemData) => {
    const { itemId } = data;

    const item = await this.inventoryDao.getItem({ itemId });
    if (item == null) {
      throw new NotFoundError('Item data not found.');
    }

    const orderedItems = await this.orderService.getOrderedItems();

    if (orderedItems.includes(item.itemId)) {
      throw new ConflictError('Cannot delete an inventory item that has an existing order transaction');
    }

    await this.inventoryDao.deleteItem(data);
  };

  public deleteItems = async (data: TMultipleDeleteItemData) => {
    const { itemIds: checkIds } = data;
    const orderedItems = await this.orderService.getOrderedItems();

    const itemIds = checkIds.filter((itemId) => !orderedItems.includes(itemId));

    await this.inventoryDao.deleteItems({ itemIds });

    if (itemIds.length !== checkIds.length) {
      throw new ConflictError('Cannot delete inventory item that has an existing order transaction');
    }
  };
}
