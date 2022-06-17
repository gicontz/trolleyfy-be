import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { IValidatedRequest } from '@requests/IValidatedRequest';

import {
  INVENTORY_TYPES,
  IInventoryController,
  IInventoryService,
} from './Inventory.ioc';

import {
  TCreateItemData,
  TGetItemData,
  TGetItemListData,
  TUpdateItemData,
  TDeleteItemData,
  TMultipleDeleteItemData,
} from './Inventory.data';

@injectable()
export default class InventoryController implements IInventoryController {
  private inventoryService: IInventoryService;

  constructor(
    @inject(INVENTORY_TYPES.iInventoryService)
    inventoryService: IInventoryService,
  ) {
    this.inventoryService = inventoryService;
  }

  public createItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TCreateItemData>;

      const data = await this.inventoryService.createItem(validatedData);

      res.status(200).json({
        message: 'Item data successfully created.',
        data: {
          data,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  public getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { validatedData } = req as IValidatedRequest<TGetItemData>;

      const data = await this.inventoryService.getItem(validatedData);

      res.status(200).json({
        message: 'Item data successfully retrieved.',
        data
      });
    } catch (e) {
      next(e);
    }
  };

  public getItemList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TGetItemListData>;

      const records = await this.inventoryService.getItemList(validatedData);

      res.status(200).json({
        message: 'Item data list successfully retrieved.',
        records,
      });
    } catch (e) {
      next(e);
    }
  };

  public updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TUpdateItemData>;

      await this.inventoryService.updateItem(validatedData);

      res.status(200).json({
        message: 'Item data successfully updated.',
      });
    } catch (e) {
      next(e);
    }
  };

  public deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TDeleteItemData>;

      await this.inventoryService.deleteItem(validatedData);

      res.status(200).json({
        message: 'Item data successfully deleted.',
      });
    } catch (e) {
      next(e);
    }
  };

  public deleteItems = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TMultipleDeleteItemData>;

      await this.inventoryService.deleteItems(validatedData);

      res.status(200).json({
        message: 'Items successfully deleted.',
      });
    } catch (e) {
      next(e);
    }
  };
}
