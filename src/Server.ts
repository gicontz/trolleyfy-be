import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import https from 'https';

import App from '@app/App';
import config from '@config/Config';
import database from '@database/Database';
import errorMiddleware from '@middlewares/ErrorMiddleware';
import iocContainer from '@config/Inversify.config';

import { SWAGGER_TYPES, ISwaggerRouter } from '@apis/swagger/Swagger.ioc';
import {
  INVENTORY_TYPES,
  IInventoryRouter,
} from '@apis/inventory/Inventory.ioc';
import {
  ORDER_TYPES,
  IOrderRouter,
} from '@apis/order/Order.ioc';

https.globalAgent.options.rejectUnauthorized =
  config.app.REJECT_UNAUTHORIZED_CERTIFICATES;

const whiteList = config.app.WHITELIST;

const app = new App({
  port: config.app.PORT,
  middlewares: [
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(config.auth.COOKIE_SECRET),
    cors({
      origin: (origin, callback) => {
        const org = origin || 'invalid';
        // undefined origin means from this API's domain
        if (whiteList.indexOf(org) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by Cors'));
        }
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    }),
  ],
  routers: [
    iocContainer.get<ISwaggerRouter>(SWAGGER_TYPES.iSwaggerRouter),
    iocContainer.get<IInventoryRouter>(INVENTORY_TYPES.iInventoryRouter),
    iocContainer.get<IOrderRouter>(ORDER_TYPES.iOrderRouter),
  ],
  errorMiddlewares: [errorMiddleware],
});

database.connect(() => {
  app.listen();
});
