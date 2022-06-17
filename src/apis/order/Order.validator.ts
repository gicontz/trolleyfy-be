import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

import { IValidatedRequest } from '@requests/IValidatedRequest';

import { IOrderValidator } from './Order.ioc';
import {
  TCreateOrderData,
  TGetOrderData,
  TGetOrderListData,
  TUpdateOrderData,
  TDeleteOrderData,
} from './Order.data';

@injectable()
export default class OrderValidator implements IOrderValidator {
  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const bodySchema = Joi.object().keys({
      items: Joi.array().items(
        Joi.object().keys({
          itemId: Joi.string().required(),
          qty: Joi.number().required(),
        }),
      ),
      paidAmt: Joi.number().required(),
    });

    try {
      const { items, paidAmt } = await bodySchema.validateAsync(req.body);

      (req as IValidatedRequest<TCreateOrderData>).validatedData = {
        items,
        paidAmt,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  public getOrder = async (req: Request, res: Response, next: NextFunction) => {
    const paramsSchema = Joi.object().keys({
      orderId: Joi.string().hex().length(24).required(),
    });

    try {
      const { orderId } = await paramsSchema.validateAsync(req.params);

      (req as IValidatedRequest<TGetOrderData>).validatedData = {
        orderId,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  public getOrderList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const querySchema = Joi.object().keys({
      qty: Joi.number(),
      createdDate: Joi.string(),
    });

    try {
      const { qty, createdDate } = await querySchema.validateAsync(req.query);

      const validatedData = {
        qty,
        createdDate,
      };

      Object.keys(validatedData).forEach(
        (key) =>
          (validatedData as { [key: string]: unknown })[key] == null &&
          delete (validatedData as { [key: string]: unknown })[key],
      );

      (req as IValidatedRequest<TGetOrderListData>).validatedData = validatedData;

      next();
    } catch (e) {
      next(e);
    }
  };

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const paramsSchema = Joi.object().keys({
      orderId: Joi.string().hex().length(24).required(),
    });

    try {
      const { orderId } = await paramsSchema.validateAsync(req.params);

      (req as IValidatedRequest<TDeleteOrderData>).validatedData = {
        orderId,
      };

      next();
    } catch (e) {
      next(e);
    }
  };
}
