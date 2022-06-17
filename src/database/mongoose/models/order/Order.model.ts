import { Schema, model, Model, Document } from 'mongoose';

import { TItemOrder, IOrder } from '@apis/order/Order.data';

export interface IOrderDocument extends IOrder, Document {}
export interface IItemOrderDocument extends TItemOrder, Document {}

export type TOrderModel = Model<IOrderDocument>;

const itemOrderSchema = new Schema<IItemOrderDocument> (
  {
    itemId: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    }
  }
);

const orderSchema = new Schema<IOrderDocument>(
  {
    items: {
      type: [itemOrderSchema],
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalAmt: {
      type: Number,
      required: true,
    },
    paidAmt: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toObject: {
      versionKey: false,
      transform(doc, ret) {
        ret.orderId = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

export default model<IOrderDocument, TOrderModel>('order', orderSchema, 'order');
