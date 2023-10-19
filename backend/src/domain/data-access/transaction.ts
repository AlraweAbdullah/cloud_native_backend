import { Transaction } from '../model/transaction';
import { client } from '../../util/db.server';
import { Customer } from '../model/customer';
import { Product } from '../model/product';
import { mapToCustomer } from '../../mapper/customer.mapper';
import { mapToProduct } from '../../mapper/product.mapper';

const addTransaction = async ({
    customerId,
    productId,
    quantity,
}: {
    customerId: string;
    productId: string;
    quantity: number;
}): Promise<Transaction> => {
    try {
        const date = new Date();
        const transactionsCollection = client.db(process.env.DATABASE).collection('transactions');

        // Create the transaction document
        const transaction = {
            quantity,
            date,
            customerId,
            productId,
        };

        // Insert the transaction into MongoDB
        const result = await transactionsCollection.insertOne(transaction);

        if (result) {
            const customer: Customer = await mapToCustomer(customerId);
            const product: Product = await mapToProduct(productId);
            return new Transaction({
                id: result.insertedId, // Use the generated _id
                customer,
                product,
                quantity,
                date,
            });
        } else {
            throw new Error('Transaction insertion failed.');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw new Error(error.message);
    }
};

// const getTransactionsOverview = async (customerId: string): Promise<Transaction[]> => {
//     try {
//         const transactionsCollection = client.db(process.env.DATABASE).collection('transactions');

//         // Query transactions based on the provided `customerId` as a string
//         const transactions = await transactionsCollection
//             .find({ customerId: customerId })
//             .toArray();

//         if (transactions) {
//             const mappedTransactions = await Promise.all(
//                 transactions.map(async (transaction) => {
//                     const product: Product = await mapToProduct(transaction.productId);
//                     const customer: Customer = await mapToCustomer(transaction.customerId);

//                     return new Transaction({
//                         id: transaction._id,
//                         customer,
//                         product,
//                         quantity: transaction.quantity,
//                         date: transaction.date,
//                     });
//                 })
//             );
//             return mappedTransactions;
//         } else {
//             return [];
//         }
//     } catch (error) {
//         throw new Error(`Error retrieving transactions: ${error.message}`);
//     }
// };
const getTransactionsOverview = async (customerId: string): Promise<Transaction[]> => {
    try {
        const productsCollection = client.db(process.env.DATABASE).collection('products');
        const transactionsCollection = client.db(process.env.DATABASE).collection('transactions');

        // Find all products associated with the customer
        const products = await productsCollection.find({ customerId: customerId }).toArray();

        // Extract and convert the product IDs to strings
        const productIds = products.map((product) => product._id.toString()); // Convert to string

        // Find transactions related to these product IDs
        const transactions = await transactionsCollection
            .find({
                productId: { $in: productIds },
            })
            .toArray();

        const mappedTransactions = await Promise.all(
            transactions.map(async (transaction) => {
                // Find the associated product
                const product = products.find((product) =>
                    product._id.equals(transaction.productId)
                );

                if (product) {
                    const mappedCustomer: Customer = await mapToCustomer(product.customerId);
                    const mappedProduct: Product = await mapToProduct(product._id); // Map the product

                    return new Transaction({
                        id: transaction._id,
                        customer: mappedCustomer,
                        product: mappedProduct, // Include the mapped product
                        quantity: transaction.quantity,
                        date: transaction.date,
                    });
                } else {
                    throw new Error(`Product not found for transaction ID: ${transaction._id}`);
                }
            })
        );

        return mappedTransactions;
    } catch (error) {
        throw new Error(`Error retrieving transactions: ${error.message}`);
    }
};
export default {
    addTransaction,
    getTransactionsOverview,
};
