import { Customer } from "./customer";
import { Product } from "./product";

export class Transaction {
    id: number;
    customer: Customer;
    product: Product;
    quantity: number;
    date: Date;

    constructor(transaction: { id: number; customer: Customer; product: Product; quantity: number; date: Date }) {
        this.id = transaction.id;
        this.customer = transaction.customer;
        this.product = transaction.product;
        this.quantity = transaction.quantity;
        this.date = transaction.date;
    }
}
