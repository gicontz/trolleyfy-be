import { injectable } from 'inversify';

import { IInventoryDao } from '@apis/inventory/Inventory.ioc';

import {
  TCreateItemData,
  TGetItemData,
  TUpdateItemData,
  TDeleteItemData,
  TGetItemListData,
  TMultipleDeleteItemData,
} from '@apis/inventory/Inventory.data';

import Inventory from '@models/inventory/Inventory.model';

@injectable()
export default class InventoryDao implements IInventoryDao {
  public createItem = async (data: TCreateItemData) => {
    const itemDocument = new Inventory({
      ...data,
    });

    await itemDocument.save();

    return itemDocument.toObject();
  };

  public getItem = async (data: TGetItemData) => {
    const { itemId, productCode } = data;

    if (itemId) {
      const itemDocument = await Inventory.findById(itemId);
      return itemDocument ? itemDocument.toObject() : null;
    }

    const itemDocument = await Inventory.findOne({productCode});
    return itemDocument ? itemDocument.toObject() : null;
  };

  public getItemList = async (data: TGetItemListData) => {
    const { ids } = data;
    if (ids) {
      const itemDocuments = await Inventory.find({ _id: { $in: ids }});
      return itemDocuments.map((document) => document.toObject());
    }
    const itemDocuments = await Inventory.find(data);
    return itemDocuments.map((document) => document.toObject());
  };

  public updateItem = async (data: TUpdateItemData) => {
    const { itemId } = data;

    await Inventory.findByIdAndUpdate(itemId, data);
  };

  public deleteItem = async (data: TDeleteItemData) => {
    const { itemId } = data;

    await Inventory.findByIdAndDelete(itemId);
  };

  public deleteItems = async (data: TMultipleDeleteItemData) => {
    const { itemIds } = data;

    await Inventory.deleteMany({_id: { $in: [...itemIds] }});
  };
}
