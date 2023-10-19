import { Customer } from './customer';
import { Product } from './product';

export class Transaction {
    id: string;
    customer: Customer;
    product: Product;
    quantity: number;
    date: Date;

    constructor(transaction: {
        id: string;
        customer: Customer;
        product: Product;
        quantity: number;
        date: Date;
    }) {
        this.id = transaction.id;
        this.customer = transaction.customer;
        this.product = transaction.product;
        this.quantity = transaction.quantity;
        this.date = transaction.date;
    }
}
