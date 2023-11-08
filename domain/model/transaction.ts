export class Transaction {
    id: string;
    buyerUsername: string;
    productSerialNumber: string;
    quantity: number;
    date: Date;
    sellerUsername: string;

    constructor(transaction: {
        id: string;
        buyerUsername: string;
        productSerialNumber: string;
        quantity: number;
        date: Date;
        sellerUsername: string;
    }) {
        this.id = transaction.id;
        this.buyerUsername = transaction.buyerUsername;
        this.productSerialNumber = transaction.productSerialNumber;
        this.quantity = transaction.quantity;
        this.date = transaction.date;
        this.sellerUsername = transaction.sellerUsername;
    }
}
