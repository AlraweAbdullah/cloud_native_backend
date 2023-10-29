export interface Sale {
    quantity: number;
    productSerialNumber: string;
    buyerUsername: string;
    date: Date;
}

export interface StatusMessage {
    type: string;
    message: string;
}

export interface Customer {
    id?: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
}

export interface Product {
    serialNumber: string;
    name: string;
    price: number;
    description: string;
    sellerUsername?: string;
}

export interface Transaction {
    quantity: number;
    buyerUsername: string;
    productSerialNumber: string;
}
