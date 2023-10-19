import { Product } from '../domain/model/product';

import customerService from './customer.service';
import productDB from '../domain/data-access/product';

import type { ProductInput } from '../types/types';

const addProduct = async ({
    name,
    price,
    description,
    customerId,
}: ProductInput): Promise<Product> => {
    await handleProductInput({ name, price, description, customerId });
    //Check if customer exists
    await customerService.getCustomerById(customerId);
    return await productDB.addProduct({ name, price, description, customerId: customerId });
};

const getProductById = async ({ id }: { id: string }): Promise<Product> =>
    await productDB.getProductById(id);

const getProductsOf = async (id: string, isMyProduct: boolean): Promise<Product[]> =>
    await productDB.getProductsOf(id, isMyProduct);

const handleProductInput = async ({ name, price, description, customerId }) => {
    if (!name || name.trim() === '') {
        throw new Error("Name can't be empty.");
    }

    if (!description || description.trim() === '') {
        throw new Error("Description can't be empty.");
    }

    if (!price || price <= 0) {
        throw new Error('Price must be a positive number.');
    }

    if (!customerId) {
        throw new Error("Customer id can't be empty.");
    }
    // check if customer exists
    await customerService.getCustomerById(customerId);
};

export default {
    addProduct,
    getProductById,
    getProductsOf,
};
