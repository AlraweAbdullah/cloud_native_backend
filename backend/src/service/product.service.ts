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
    return await productDB.addProduct({ name, price, description, customerId: customerId });
};

const updateProduct = async ({
    id,
    name,
    price,
    description,
    customerId,
}: ProductInput): Promise<Product> => {
    await handleProductInput({ name, price, description, customerId });

    // Check if product exists
    await getProductById({ id });
    return await productDB.updateProduct({ id, name, price, description, customerId: customerId });
};

const getProductById = async ({ id }: { id: number }): Promise<Product> =>
    await productDB.getProductById({ id: id });

const getAllProducts = async (): Promise<Product[]> => await productDB.getAllProducts();

const getProductsOf = async (id: number, isMyProduct: boolean): Promise<Product[]> =>
    await productDB.getProductsOf(id, isMyProduct);

const deleteProductById = async ({ id }: { id: number }) =>
    await productDB.deleteProductById({ id: id });

const getProductByName = async ({ name }: { name: string }): Promise<Product[] | Error> =>
    await productDB.getProductByName({ name: name });

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
    await customerService.getCustomerById({ id: customerId });
};

export default {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    getProductByName,
    updateProduct,
    getProductsOf,
};
