import { Router, Request, Response, NextFunction } from 'express';

import {
  IItem,
  TCreateItemData,
  TGetItemData,
  TGetItemListData,
  TUpdateItemData,
  TDeleteItemData,
  TMultipleDeleteItemData,
} from './Inventory.data';

export const INVENTORY_TYPES = {
  iInventoryRouter: Symbol.for('IInventoryRouter'),
  iInventoryValidator: Symbol.for('IInventoryValidator'),
  iInventoryController: Symbol.for('IInventoryController'),
  iInventoryService: Symbol.for('IInventoryService'),
  iInventoryDao: Symbol.for('IInventoryDao'),
};

export interface IInventoryRouter {
  path: string;
  router: Router;
}

export interface IInventoryValidator {
  createItem: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getItemList: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateItem: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteItem: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteItems: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export interface IInventoryController {
  createItem: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getItemList: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateItem: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteItem: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteItems: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export interface IInventoryService {
  createItem: (data: TCreateItemData) => Promise<IItem>;
  getItem: (data: TGetItemData) => Promise<IItem>;
  getItemList: (data: TGetItemListData) => Promise<IItem[]>;
  updateItem: (data: TUpdateItemData) => Promise<void>;
  deleteItem: (data: TDeleteItemData) => Promise<void>;
  deleteItems: (data: TMultipleDeleteItemData) => Promise<void>;
}

export interface IInventoryDao {
  createItem: (data: TCreateItemData) => Promise<IItem>;
  getItem: (data: TGetItemData) => Promise<IItem | null>;
  getItemList: (data: TGetItemListData) => Promise<IItem[]>;
  updateItem: (data: TUpdateItemData) => Promise<void>;
  deleteItem: (data: TDeleteItemData) => Promise<void>;
  deleteItems: (data: TMultipleDeleteItemData) => Promise<void>;
}
