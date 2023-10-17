import { Transaction } from '../domain/model/transaction';
import { TransactionPrisma } from '../util/db.server';
import { mapToCustomer } from './customer.mapper';
import { mapToProduct } from './product.mapper';

const mapToTransaction = (transactionPrisma: TransactionPrisma): Transaction => {
    // Create a new Transaction instance
    return new Transaction({
        id: transactionPrisma.id,
        customer: mapToCustomer(transactionPrisma.customer),
        product: mapToProduct(transactionPrisma.product),
        quantity: transactionPrisma.quantity,
        date: new Date(transactionPrisma.date),
    });
};

const mapToTransactions = (transactionPrismaArray: TransactionPrisma[]): Transaction[] => {
    return transactionPrismaArray.map(mapToTransaction);
};

export { mapToTransaction, mapToTransactions };
