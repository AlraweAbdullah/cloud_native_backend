export interface ProductInput {
  serialNumber: string;
  name: string;
  price: number;
  description: string;
  sellerUsername: string;
}

export type CustomerInput = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
};

export type CustomerCredintials = {
  username: string;
  password: string;
};

export type TransactionInput = {
  productSerialNumber: string;
  quantity: number;
  date?: Date;
  buyerUsername: string;
};

export type CustomerLoginInput = {
  id: number;
  username: string;
  password: string;
};
