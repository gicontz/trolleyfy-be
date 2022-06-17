import { Schema, model, Model, Document } from 'mongoose';

import { ITEM_CATEGORIES, IItem } from '@apis/inventory/Inventory.data';

export interface IItemDocument extends IItem, Document {}

export type TItemModel = Model<IItemDocument>;

const itemSchema = new Schema<IItemDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ITEM_CATEGORIES,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
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
        ret.itemId = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

export default model<IItemDocument, TItemModel>('item', itemSchema, 'item');
