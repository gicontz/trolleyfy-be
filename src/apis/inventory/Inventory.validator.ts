import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

import { IValidatedRequest } from '@requests/IValidatedRequest';

import { IInventoryValidator } from './Inventory.ioc';
import {
  ITEM_CATEGORIES,
  TCreateItemData,
  TGetItemData,
  TGetItemListData,
  TUpdateItemData,
  TDeleteItemData,
  TMultipleDeleteItemData,
} from './Inventory.data';

@injectable()
export default class InventoryValidator implements IInventoryValidator {
  public createItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const bodySchema = Joi.object().keys({
      category: Joi.string()
        .valid(...ITEM_CATEGORIES)
        .required(),
      name: Joi.string().required(),
      productCode: Joi.string().required(),
      price: Joi.string().required(),
      qty: Joi.number().required(),
      description: Joi.string().allow(''),
    });

    try {
      const {
        category,
        name,
        productCode,
        price,
        qty,
        description,
      } = await bodySchema.validateAsync(req.body);

      (req as IValidatedRequest<TCreateItemData>).validatedData = {
        category,
        name,
        productCode,
        price,
        qty,
        description,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  public getItem = async (req: Request, res: Response, next: NextFunction) => {
    const querySchema = Joi.object().keys({
      itemId: Joi.string().hex().length(24),
      productCode: Joi.string(),
    });

    try {
      const { itemId, productCode } = await querySchema.validateAsync(req.query);

      (req as IValidatedRequest<TGetItemData>).validatedData = {
        itemId,
        productCode,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  public getItemList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const querySchema = Joi.object().keys({
      category: Joi.string().valid(...ITEM_CATEGORIES),
      priceStart: Joi.string(),
      priceEnd: Joi.string(),
    });

    try {
      const {
        category,
        priceStart,
        priceEnd,
      } = await querySchema.validateAsync(req.query);

      const validatedData = {
        category,
        priceStart,
        priceEnd,
      };

      Object.keys(validatedData).forEach(
        (key) =>
          (validatedData as { [key: string]: unknown })[key] == null &&
          delete (validatedData as { [key: string]: unknown })[key],
      );

      (req as IValidatedRequest<TGetItemListData>).validatedData = validatedData;

      next();
    } catch (e) {
      next(e);
    }
  };

  public updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const paramsSchema = Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    });
    const bodySchema = Joi.object().keys({
      category: Joi.string()
        .valid(...ITEM_CATEGORIES)
        .required(),
      name: Joi.string().required(),
      productCode: Joi.string().required(),
      price: Joi.string().required(),
      qty: Joi.number().required(),
      description: Joi.string().allow(''),
    });

    try {
      const [
        { itemId },
        { category, name, qty, productCode, price, description },
      ] = await Promise.all([
        paramsSchema.validateAsync(req.params),
        bodySchema.validateAsync(req.body),
      ]);

      (req as IValidatedRequest<TUpdateItemData>).validatedData = {
        itemId,
        category,
        name,
        productCode,
        price,
        qty,
        description,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  public deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const paramsSchema = Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    });

    try {
      const { itemId } = await paramsSchema.validateAsync(req.params);

      (req as IValidatedRequest<TDeleteItemData>).validatedData = {
        itemId,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  public deleteItems = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const bodySchema = Joi.object().keys({
      itemIds: Joi.array().items(Joi.string().hex().length(24)).required(),
    });

    try {
      const { itemIds } = await bodySchema.validateAsync(req.body);

      (req as IValidatedRequest<TMultipleDeleteItemData>).validatedData = {
        itemIds,
      };

      next();
    } catch (e) {
      next(e);
    }
  };
}
