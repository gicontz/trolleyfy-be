import { injectable, inject } from 'inversify';

import NotFoundError from '@errors/NotFoundError';

import { ORDER_TYPES, IOrderService, IOrderDao } from './Order.ioc';
import { INVENTORY_TYPES, IInventoryDao } from '@apis/inventory/Inventory.ioc';

import {
  TItemOrder,
  TCreateOrderData,
  TGetOrderData,
  TGetOrderListData,
  TDeleteOrderData,
  IOrder,
} from './Order.data';
import ConflictError from '@errors/ConflictError';

@injectable()
export default class OrderService implements IOrderService {
  private orderDao: IOrderDao;
  private invDao: IInventoryDao;


  constructor(@inject(ORDER_TYPES.iOrderDao) orderDao: IOrderDao,
    @inject(INVENTORY_TYPES.iInventoryDao) invDao: IInventoryDao) {
      this.orderDao = orderDao;
      this.invDao = invDao;
  }

  private checkInventory = async (items: TItemOrder[]): Promise<boolean> => {
    const ids = items.map(({itemId}) => itemId);
    const invItems = await this.invDao.getItemList({ids});

    if (invItems.length > 0) {
      for (const item of items) {
        const invItem = invItems.find((obj) => obj.itemId === item.itemId);
        if (!invItem) {
          throw new NotFoundError(`An item was not found in the inventory!`);
        }
        if (invItem.qty < item.qty) {
          throw new ConflictError(`An item is not available or not sufficient to the requested quantity`);
        }
      }
    } else {
      throw new ConflictError(`Items are not in inventory`);
    }

    return true;
  }

  private consolidateInventory = async (items: TItemOrder[], payment: Pick<IOrder, 'paidAmt'>): Promise<Pick<IOrder, 'totalAmt' | 'totalQty' | 'change'>> => {
    const output = {
      totalAmt: 0,
      totalQty: 0,
      change: 0,
    };
    const ids = items.map(({itemId}) => itemId);
    const invItems = await this.invDao.getItemList({ids});

    for (const item of items) {
      const invItem = invItems.find((obj) => obj.itemId === item.itemId);
      if (!invItem) {
        throw new NotFoundError(`An item was not found in the inventory!`);
      }
      if (invItem.qty < item.qty) {
        throw new ConflictError(`An item is not available or not sufficient to the requested quantity`);
      }
      output.totalAmt += parseInt(invItem.price, 10) * item.qty;
      output.totalQty += item.qty;
    }

    if (payment.paidAmt < output.totalAmt) {
      throw new ConflictError(`Paid amount is insufficient`);
    }

    output.change = payment.paidAmt - output.totalAmt;

    for (const item of items) {
      const invItem = invItems.find((obj) => obj.itemId === item.itemId);

      if (invItem) {
        await this.invDao.updateItem({...invItem, qty: invItem.qty - item.qty});
      }
    }

    return output;
  }

  public createOrder = async (data: TCreateOrderData) => {
    const { items, paidAmt } = data;

    const validOrder = await this.checkInventory(items);

    if (validOrder) {
      const audit = await this.consolidateInventory(items, { paidAmt });
      const { totalAmt, totalQty, change } = audit;
      const order = await this.orderDao.createOrder({...data, totalAmt, totalQty, change});
      return order;
    }

    return;
  };

  public getOrder = async (data: TGetOrderData) => {
    const order = await this.orderDao.getOrder(data);
    if (order == null) {
      throw new NotFoundError('EMS data not found.');
    }

    return order;
  };

  public getOrderList = async (data: TGetOrderListData) => {
    const orderList = await this.orderDao.getOrderList(data);
    const consOrders = await Promise.all(orderList.map(async (order) => {
      const items = await Promise.all(order.items.map(async (item) => {
        const itemIds = order.items.map(({itemId}) => itemId);
        const invItems = await this.invDao.getItemList({ids: itemIds});
        return {
          ...item,
          itemName: invItems.find((obj => obj.itemId === item.itemId))?.name,
          itemDesc: invItems.find((obj => obj.itemId === item.itemId))?.description,
          productCode: invItems.find((obj => obj.itemId === item.itemId))?.productCode,
        }
      }));
      return {
        ...order,
        items,
      }
    }));

    return consOrders;
  };

  public getOrderedItems = async () => {
    const orderList = await this.orderDao.getOrderList({});
    const orderedItems = orderList.map((order) => order.items.map(({itemId}) => itemId));
    return orderedItems.flat();
  }

  public deleteOrder = async (data: TDeleteOrderData) => {
    const { orderId } = data;

    const order = await this.orderDao.getOrder({ orderId });
    if (order == null) {
      throw new NotFoundError('Order data not found.');
    }

    await this.orderDao.deleteOrder(data);
  };
}
