import { client } from '../../util/db.server';
import { Product } from '../model/product';
import { ObjectId } from 'mongodb';
import { Customer } from '../model/customer';

const addProduct = async ({
    name,
    price,
    description,
    customerId,
}: {
    name: string;
    price: number;
    description: string;
    customerId: string;
}): Promise<Product> => {
    try {
        const productsCollection = client.db(process.env.DATABASE).collection('products');

        // Check if the product name already exists for the customer
        const existingProduct = await productsCollection.findOne({
            name,
            customerId,
        });

        if (existingProduct) {
            throw new Error(`Seller already has a product with name ${name}.`);
        }

        // Create the product document
        const product = {
            name,
            price,
            description,
            customerId,
        };

        // Insert the product into MongoDB
        const result = await productsCollection.insertOne(product);
        if (result) {
            return new Product({
                id: result.insertedId,
                name,
                price,
                description,
            });
        } else {
            throw new Error('Product insertion failed.');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error(error.message);
    }
};

const getProductById = async (id: string): Promise<Product> => {
    try {
        const productsCollection = client.db(process.env.DATABASE).collection('products');
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (product) {
            return new Product({
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
            });
        } else {
            throw new Error(`Product with ID ${id} couldn't be found`);
        }
    } catch (error) {
        throw new Error(`Error retrieving product: ${error.message}`);
    }
};

const getProductsOf = async (customerId: string, isMyProduct: boolean): Promise<Product[]> => {
    try {
        const productsCollection = client.db(process.env.DATABASE).collection('products');

        const query = isMyProduct ? { customerId } : { customerId: { $ne: customerId } }; // $ne means not equal

        const products = await productsCollection.find(query).toArray();

        const mappedProducts = products.map(
            (product) =>
                new Product({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                })
        );

        return mappedProducts;
    } catch (error) {
        throw new Error(`Error fetching products: ${error.message}`);
    }
};

export default {
    addProduct,
    getProductById,
    getProductsOf,
};
