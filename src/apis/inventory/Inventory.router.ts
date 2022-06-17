import { Router } from 'express';
import { injectable, inject } from 'inversify';

import {
  INVENTORY_TYPES,
  IInventoryRouter,
  IInventoryValidator,
  IInventoryController,
} from './Inventory.ioc';

@injectable()
export default class OrderRouter implements IInventoryRouter {
  public path: string;

  public router: Router;

  private inventoryValidator: IInventoryValidator;

  private inventoryController: IInventoryController;

  constructor(
    @inject(INVENTORY_TYPES.iInventoryValidator)
    inventoryValidator: IInventoryValidator,
    @inject(INVENTORY_TYPES.iInventoryController)
    inventoryController: IInventoryController,
  ) {
    this.path = '/inventory';
    this.router = Router();

    this.inventoryValidator = inventoryValidator;
    this.inventoryController = inventoryController;

    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      `${this.path}/create`,
      this.inventoryValidator.createItem,
      this.inventoryController.createItem,
    );

    this.router.get(
      `${this.path}/item`,
      this.inventoryValidator.getItem,
      this.inventoryController.getItem,
    );

    this.router.get(
      `${this.path}`,
      this.inventoryValidator.getItemList,
      this.inventoryController.getItemList,
    );

    this.router.patch(
      `${this.path}/:itemId`,
      this.inventoryValidator.updateItem,
      this.inventoryController.updateItem,
    );

    this.router.delete(
      `${this.path}/:itemId`,
      this.inventoryValidator.deleteItem,
      this.inventoryController.deleteItem,
    );

    this.router.post(
      `${this.path}/delete/multiple`,
      this.inventoryValidator.deleteItems,
      this.inventoryController.deleteItems,
    );
  };
}
