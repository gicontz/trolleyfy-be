import 'reflect-metadata';

import { Container } from 'inversify';

import swaggerBind from './inversify/Swagger.config';
import inventoryBind from './inversify/Inventory.config';
import orderBind from './inversify/Order.config';

const iocContainer = new Container();
swaggerBind(iocContainer);
inventoryBind(iocContainer);
orderBind(iocContainer);

export default iocContainer;
