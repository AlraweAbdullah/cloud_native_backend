import exp from 'constants';

export interface Sale {
    quantity: number;
    product: Product;
    date: Date;
}

export interface Author {
    id?: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface StatusMessage {
    type: string;
    message: string;
}

export interface Customer {
    id?: number;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
}

export interface Product {
    id?: number;
    name: string;
    price: number;
    description: string;
    customerId?: number;
}
