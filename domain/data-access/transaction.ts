import { Transaction } from "../model/transaction";

import { CosmosClient } from "@azure/cosmos";
import { mapToTransaction } from "../../mapper/transaction.mapper";
import { Product } from "../model/product";
import { Customer } from "../model/customer";

const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;

const cosmosClient = new CosmosClient({
  endpoint: cosmosEndpoint,
  key: cosmosKey,
});
const container = cosmosClient.database(databaseName).container("Transactions");

const addTransaction = async ({
  buyer,
  product,
  quantity,
}: {
  buyer: Customer;
  product: Product;
  quantity: number;
}): Promise<Transaction> => {
  const currentDate = new Date();
  const id = `${product.serialNumber}_${buyer.username}_${
    product.sellerUsername
  }_${currentDate.getTime()}`;

  const transaction = {
    id: id,
    buyerUsername: buyer.username,
    productSerialNumber: product.serialNumber,
    quantity: quantity,
    date: currentDate,
    sellerUsername: product.sellerUsername,
    partition: id.substring(0, 3),
  };

  const { resource } = await container.items.create(transaction);

  if (resource) {
    return mapToTransaction({
      id,
      buyerUsername: buyer.username,
      sellerUsername: product.sellerUsername,
      productSerialNumber: product.serialNumber,
      quantity,
      date: currentDate,
    });
  } else {
    throw new Error("Transaction could not be added.");
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
const getSalessOverview = async (username: string): Promise<Transaction[]> => {
  const querySpec = {
    query: "SELECT * FROM c WHERE c.sellerUsername = @sellerUsername",
    parameters: [
      {
        name: "@sellerUsername",
        value: username,
      },
    ],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  const mappedTransactions = await Promise.all(
    resources.map((transaction) => mapToTransaction(transaction))
  );
  return mappedTransactions;
};

const getTransactionsOverview = async (
  buyerUsername: string
): Promise<Transaction[]> => {
  const querySpec = {
    query: "SELECT * FROM c WHERE c.buyerUsername = @buyerUsername",
    parameters: [
      {
        name: "@buyerUsername",
        value: buyerUsername,
      },
    ],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  const mappedTransactions = await Promise.all(
    resources.map((transaction) => mapToTransaction(transaction))
  );
  return mappedTransactions;
};

export default {
  addTransaction,
  getSalessOverview,
};
