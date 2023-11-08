import { Transaction } from "../domain/model/transaction";
import customerService from "./customer.service";

import transactionDB from "../domain/data-access/transaction";

import type { TransactionInput } from "../types/types";
import productService from "./product.service";
import { Product } from "../domain/model/product";
import { Customer } from "../domain/model/customer";

const addtTransaction = async (
  transaction: TransactionInput
): Promise<Transaction> => {
  const product: Product = await productService.getProduct(
    transaction.productSerialNumber
  );
  const buyer: Customer = await customerService.getCustomer(
    transaction.buyerUsername
  );
  await handleTransaction(transaction);
  return await transactionDB.addTransaction({
    buyer: buyer,
    product: product,
    quantity: transaction.quantity,
  });
};

const handleTransaction = async (transaction: TransactionInput) => {
  if (!transaction.quantity || transaction.quantity <= 0) {
    throw new Error("Quantity must be a positive number.");
  }

  if (!transaction.productSerialNumber) {
    throw new Error("Product serialNumber can't be empty.");
  }

  await customerService.getCustomer(transaction.buyerUsername);
};

const getSalesOverview = (username: string): Promise<Transaction[]> => {
  return transactionDB.getSalessOverview(username);
};

export default {
  addtTransaction,
  getSalesOverview,
};
