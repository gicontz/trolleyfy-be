export type TItemOrder = {
  itemId: string;
  qty: number;
  itemName?: string;
  itemDesc?: string;
  productCode?: string;
};

export interface IOrder {
  orderId: string;
  items: TItemOrder[];
  totalQty: number;
  totalAmt: number;
  paidAmt: number;
  change: number;
}

export type TCreateOrderData = {
  items: TItemOrder[];
  paidAmt: number;
};

export type TNewOrderData = {
  items: TItemOrder[];
  totalQty: number;
  totalAmt: number;
  paidAmt: number;
  change: number
};

export type TUpdateOrderData = {
  orderId: string;
  items: TItemOrder[];
};

export type TDeleteOrderData = {
  orderId: string;
};

export type TGetOrderData = {
  orderId: string;
};

export type TGetOrderListData = {
  qty?: number;
  createdDate?: string;
  ids?: string[];
};
