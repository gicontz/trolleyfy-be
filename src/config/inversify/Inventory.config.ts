import { Container } from 'inversify';

import {
  ORDER_TYPES,
  IOrderRouter,
  IOrderValidator,
  IOrderController,
  IOrderService,
  IOrderDao,
} from '@apis/order/Order.ioc';
import OrderRouter from '@apis/order/Order.router';
import OrderValidator from '@apis/order/Order.validator';
import OrderController from '@apis/order/Order.controller';
import OrderService from '@apis/order/Order.service';
import OrderDao from '@daos/order/Order.dao';

export default (iocContainer: Container) => {
  iocContainer
    .bind<IOrderRouter>(ORDER_TYPES.iOrderRouter)
    .to(OrderRouter);
  iocContainer
    .bind<IOrderValidator>(ORDER_TYPES.iOrderValidator)
    .to(OrderValidator);
  iocContainer
    .bind<IOrderController>(ORDER_TYPES.iOrderController)
    .to(OrderController);
  iocContainer
    .bind<IOrderService>(ORDER_TYPES.iOrderService)
    .to(OrderService);
  iocContainer
    .bind<IOrderDao>(ORDER_TYPES.iOrderDao)
    .to(OrderDao);
};
