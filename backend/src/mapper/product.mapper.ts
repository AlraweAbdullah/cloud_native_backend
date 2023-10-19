import { Product } from '../domain/model/product';
import { client } from '../util/db.server';
import { ObjectId } from 'mongodb';

const mapToProduct = async (productId): Promise<Product> => {
    const productsCollection = client.db(process.env.DATABASE).collection('products');

    const productDB = await productsCollection.findOne({
        _id: new ObjectId(productId),
    });

    return new Product({
        id: productId,
        name: productDB.name,
        price: productDB.price,
        description: productDB.description,
    });
};

export { mapToProduct };
