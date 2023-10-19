export type ProductInput = {
    id: number;
    name: string;
    price: number;
    description: string;
    customerId: string;
};

export type TransactionInput = {
    id: number;
    quantity: number;
    date: Date;
    customerId: string;
    productId: string;
};

export type CustomerInput = {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
};

export type CustomerLoginInput = {
    id: number;
    username: string;
    password: string;
};

export type CategoryInput = {
    id: number;
    name: string;
};
