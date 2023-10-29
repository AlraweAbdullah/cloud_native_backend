import { Customer } from '../domain/model/customer';
import { Product } from '../domain/model/product';
import { Transaction } from '../domain/model/transaction';

const mapToTransaction = ({
    id,
    buyer,
    product,
    quantity,
    date,
}: {
    id: string;
    buyer: Customer;
    product: Product;
    quantity: number;
    date: Date;
}): Transaction => {
    return new Transaction({
        id: id,
        buyerUsername: buyer.username,
        productSerialNumber: product.serialNumber,
        quantity: quantity,
        date: date,
        sellerUsername: product.sellerUsername,
    });
};

export { mapToTransaction };
