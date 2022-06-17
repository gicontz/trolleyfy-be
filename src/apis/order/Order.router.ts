import { Router } from 'express';
import { injectable, inject } from 'inversify';

import {
  ORDER_TYPES,
  IOrderRouter,
  IOrderValidator,
  IOrderController,
} from './Order.ioc';

@injectable()
export default class OrderRouter implements IOrderRouter {
  public path: string;

  public router: Router;

  private orderValidator: IOrderValidator;

  private orderController: IOrderController;

  constructor(
    @inject(ORDER_TYPES.iOrderValidator) orderValidator: IOrderValidator,
    @inject(ORDER_TYPES.iOrderController) orderController: IOrderController,
  ) {
    this.path = '/order';
    this.router = Router();

    this.orderValidator = orderValidator;
    this.orderController = orderController;

    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      `${this.path}/create`,
      this.orderValidator.createOrder,
      this.orderController.createOrder,
    );

    this.router.get(
      `${this.path}/:orderId`,
      this.orderValidator.getOrder,
      this.orderController.getOrder,
    );

    this.router.get(
      `${this.path}`,
      this.orderValidator.getOrderList,
      this.orderController.getOrderList,
    );

    this.router.delete(
      `${this.path}/:orderId`,
      this.orderValidator.deleteOrder,
      this.orderController.deleteOrder,
    );
  };
}
