export type TItemCategory =
  | 'canned-goods'
  | 'frozen-food'
  | 'essentials'
  | 'apparel'
  | 'meat'
  | 'vegetable'
  | 'fruit'
  | 'electronics'
  | 'hygiene';

export const ITEM_CATEGORIES: TItemCategory[] = [
  'apparel',
  'canned-goods',
  'electronics',
  'essentials',
  'fruit',
  'hygiene',
  'meat',
  'vegetable',
  'frozen-food',
];

export interface IItem {
  itemId: string;
  category: TItemCategory;
  qty: number;
  name: string;
  productCode: string;
  price: string;
  description: string;
}

export type TCreateItemData = {
  category: TItemCategory;
  name: string;
  qty: number;
  productCode: string;
  price: string;
  description: string;
};

export type TGetItemData = {
  itemId?: string;
  productCode?: string;
};

export type TGetItemListData = {
  category?: TItemCategory;
  priceStart?: string;
  priceEnd?: string;
  ids?: string[];
};

export type TUpdateItemData = {
  itemId: string;
  category: TItemCategory;
  name: string;
  qty: number;
  productCode: string;
  price: string;
  description: string;
};

export type TDeleteItemData = {
  itemId: string;
};

export type TMultipleDeleteItemData = {
  itemIds: string[];
};
