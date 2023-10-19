export class Product {
    readonly id?: number;
    readonly name: string;
    readonly price: number;
    readonly description: string;

    constructor(product: { id?: number; name: string; price: number; description: string }) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.description = product.description;
    }
}
