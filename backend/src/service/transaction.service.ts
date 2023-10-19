import { Transaction } from '../domain/model/transaction';
import customerService from './customer.service';
import productService from './product.service';

import transactionDB from '../domain/data-access/transaction';

import type { TransactionInput } from '../types/types';

const addtTransaction = async ({
    quantity,
    customerId,
    productId,
}: TransactionInput): Promise<Transaction> => {
    await handleTransactionInput({ quantity, customerId, productId });
    return await transactionDB.addTransaction({ customerId, productId, quantity });
};

const handleTransactionInput = async ({ quantity, customerId, productId }) => {
    if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be a positive number.');
    }

    if (!productId) {
        throw new Error("Product id can't be empty.");
    }

    if (!customerId) {
        throw new Error("Buyer id can't be empty.");
    }

    await customerService.getCustomerById(customerId);
    await productService.getProductById({ id: productId });
};

const getTransactionsOverview = ({ customerId }): Promise<Transaction[]> =>
    transactionDB.getTransactionsOverview(customerId);

export default {
    addtTransaction,
    getTransactionsOverview,
};
