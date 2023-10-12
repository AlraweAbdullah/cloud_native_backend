import { Customer } from "./customer";


export class Product {
    readonly id: number;
    readonly name: string;
    readonly price: number;
    readonly stock: number;
    readonly description: string;
    readonly customer: Customer

    //private readonly categories: Category []
    constructor (product : {id:number, name:string, price:number, stock:number,description:string, customer:Customer}){
        this.id  = product.id;
        this.name  = product.name;
        this.price  = product.price;
        this.stock  = product.stock;
        this.description  = product.description;
        this.customer  = product.customer;
    }

    static create(id:number, name:string, price:number, stock:number,description:string, customer:Customer){
        return new Product( {id:id, name:name, price:price, stock:stock, description:description, customer:customer})
    }

  
}