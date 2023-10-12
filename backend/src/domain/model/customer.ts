import { Country } from "./country"
export class Customer {
    readonly id: number;
    readonly name: string;
    readonly lastname: string;
    readonly username: string;
    readonly password: string;
    readonly country: Country;
    
    
    constructor (customer : {id:number, name:string, lastname:string ,username:string, password:string, country:Country}){
        this.id  =  customer.id;
        this.name = customer.name;
        this.lastname = customer.lastname;
        this.username = customer.username;
        this.password = customer.password;
        this.country = customer.country;
    }

    static create(id:number, name:string, lastname:string, username:string,password:string, country:Country){
        return new Customer( {id:id, name:name,lastname:lastname, username:username, password:password,country:country})
    }
}