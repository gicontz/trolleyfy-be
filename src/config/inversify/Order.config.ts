import { Container } from 'inversify';

import {
  INVENTORY_TYPES,
  IInventoryRouter,
  IInventoryValidator,
  IInventoryController,
  IInventoryService,
  IInventoryDao,
} from '@apis/inventory/Inventory.ioc';
import InventoryRouter from '@apis/inventory/Inventory.router';
import InventoryValidator from '@apis/inventory/Inventory.validator';
import InventoryController from '@apis/inventory/Inventory.controller';
import InventoryService from '@apis/inventory/Inventory.service';
import InventoryDao from '@daos/inventory/Inventory.dao';

export default (iocContainer: Container) => {
  iocContainer
    .bind<IInventoryRouter>(INVENTORY_TYPES.iInventoryRouter)
    .to(InventoryRouter);
  iocContainer
    .bind<IInventoryValidator>(INVENTORY_TYPES.iInventoryValidator)
    .to(InventoryValidator);
  iocContainer
    .bind<IInventoryController>(INVENTORY_TYPES.iInventoryController)
    .to(InventoryController);
  iocContainer
    .bind<IInventoryService>(INVENTORY_TYPES.iInventoryService)
    .to(InventoryService);
  iocContainer
    .bind<IInventoryDao>(INVENTORY_TYPES.iInventoryDao)
    .to(InventoryDao);
};
