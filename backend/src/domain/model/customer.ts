import { Product } from './product';

export class Customer {
    readonly id: number;
    readonly firstname: string;
    readonly lastname: string;
    readonly username: string;
    readonly password: string;
    readonly products: Product[];

    constructor(customer: {
        id: number;
        firstname: string;
        lastname: string;
        username: string;
        password: string;
        products: Product[];
    }) {
        this.id = customer.id;
        this.firstname = customer.firstname;
        this.lastname = customer.lastname;
        this.username = customer.username;
        this.password = customer.password;
        this.products = customer.products;
    }
}
