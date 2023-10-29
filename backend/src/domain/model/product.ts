export class Product {
    readonly serialNumber: string;
    readonly name: string;
    readonly price: number;
    readonly description: string;
    readonly sellerUsername: string;
    constructor(product: {
        serialNumber: string;
        name: string;
        price: number;
        description: string;
        sellerUsername: string;
    }) {
        this.serialNumber = product.serialNumber;
        this.name = product.name;
        this.price = product.price;
        this.description = product.description;
        this.sellerUsername = product.sellerUsername;
    }
}
