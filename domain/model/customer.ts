import { Product } from './product';

export class Customer {
    readonly firstname: string;
    readonly lastname: string;
    readonly username: string;
    readonly password: string;

    constructor(customer: {
        firstname: string;
        lastname: string;
        username: string;
        password: string;
    }) {
        this.firstname = customer.firstname;
        this.lastname = customer.lastname;
        this.username = customer.username;
        this.password = customer.password;
    }
}
