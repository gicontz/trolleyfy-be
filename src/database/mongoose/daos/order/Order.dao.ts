import { injectable } from 'inversify';

import { IOrderDao } from '@apis/order/Order.ioc';

import {
  TGetOrderData,
  TUpdateOrderData,
  TDeleteOrderData,
  TNewOrderData,
  TGetOrderListData,
} from '@apis/order/Order.data';

import Order from '@models/order/Order.model';

@injectable()
export default class OrderDao implements IOrderDao {
  public createOrder = async (data: TNewOrderData) => {
    const orderDocument = new Order({
      ...data,
    });

    await orderDocument.save();

    return orderDocument.toObject();
  };

  public getOrder = async (data: TGetOrderData) => {
    const { orderId } = data;

    const orderDocument = await Order.findById(orderId);
    return orderDocument ? orderDocument.toObject() : null;
  };

  public getOrderList = async (data: TGetOrderListData) => {
    const { ids } = data;
    if (ids) {
      const orderDocuments = await Order.find({ _id: { $in: ids }});
      return orderDocuments.map((document) => document.toObject());
    }
    const orderDocuments = await Order.find(data);
    return orderDocuments.map((document) => document.toObject());
  };

  public deleteOrder = async (data: TDeleteOrderData) => {
    const { orderId } = data;

    await Order.findByIdAndDelete(orderId);
  };
}
