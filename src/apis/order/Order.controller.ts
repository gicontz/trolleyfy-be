import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { IValidatedRequest } from '@requests/IValidatedRequest';

import { ORDER_TYPES, IOrderController, IOrderService } from './Order.ioc';

import {
  TCreateOrderData,
  TGetOrderData,
  TGetOrderListData,
  TUpdateOrderData,
  TDeleteOrderData,
} from './Order.data';

@injectable()
export default class OrderController implements IOrderController {
  private orderService: IOrderService;

  constructor(@inject(ORDER_TYPES.iOrderService) orderService: IOrderService) {
    this.orderService = orderService;
  }

  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TCreateOrderData>;

      const order = await this.orderService.createOrder(validatedData);

      res.status(200).json({
        message: 'Order data successfully created.',
        order,
      });
    } catch (e) {
      next(e);
    }
  };

  public getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { validatedData } = req as IValidatedRequest<TGetOrderData>;

      const ems = await this.orderService.getOrder(validatedData);

      res.status(200).json({
        message: 'Order data successfully retrieved.',
        data: {
          ems,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  public getOrderList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TGetOrderListData>;

      const orders = await this.orderService.getOrderList(validatedData);

      res.status(200).json({
        message: 'Order data list successfully retrieved.',
        orders,
      });
    } catch (e) {
      next(e);
    }
  };

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TDeleteOrderData>;

      await this.orderService.deleteOrder(validatedData);

      res.status(200).json({
        message: 'Order data successfully deleted.',
      });
    } catch (e) {
      next(e);
    }
  };
}
