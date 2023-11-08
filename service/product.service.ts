import { Product } from "../domain/model/product";

import customerService from "./customer.service";
import productDB from "../domain/data-access/product";

import type { ProductInput } from "../types/types";

const addProduct = async (product: ProductInput): Promise<Product> => {
  await validateProduct(product);
  //Check if customer exists
  await customerService.getCustomer(product.sellerUsername);
  if (await productDB.productExists(product.serialNumber)) {
    throw new Error(
      `Product with serial number ${product.serialNumber}  already exist`
    );
  } else {
    return await productDB.addProduct(product);
  }
};

const getProducts = async (
  customerUsername: string,
  customerProducts: boolean
): Promise<Product[]> => {
  //Check user existence
  await customerService.getCustomer(customerUsername);
  let products: Product[];
  customerProducts
    ? (products = await productDB.getCustomerProducts(customerUsername))
    : (products = await productDB.getOtherCustomerProducts(customerUsername));

  return products;
};

const getProduct = async (serialNumber: string) =>
  await productDB.getProduct(serialNumber);

const validateProduct = async (product: ProductInput) => {
  if (!product.name || product.name.trim() === "") {
    throw new Error("Name can't be empty.");
  }

  if (!product.description || product.description.trim() === "") {
    throw new Error("Description can't be empty.");
  }

  if (!product.price || product.price <= 0) {
    throw new Error("Price must be a positive number.");
  }

  if (!product.sellerUsername) {
    throw new Error("Seller username can't be empty.");
  }
};
export default {
  addProduct,
  getProducts,
  getProduct,
};
