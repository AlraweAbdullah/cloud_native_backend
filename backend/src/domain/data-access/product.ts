import { CosmosClient } from '@azure/cosmos';
import { Product } from '../model/product';
import { ProductDocument } from '../../types/types';
import { mapToProduct } from '../../mapper/product.mapper';

const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;

const cosmosClient = new CosmosClient({
    endpoint: cosmosEndpoint,
    key: cosmosKey,
});
const container = cosmosClient.database(databaseName).container('Products');

const addProduct = async (product: ProductDocument): Promise<Product> => {
    const { resource } = await container.items.create({
        id: product.serialNumber,
        name: product.name,
        price: product.price,
        description: product.description,
        sellerUsername: product.sellerUsername,
        partition: product.serialNumber.substring(0, 3),
    });
    if (resource) {
        return mapToProduct(resource);
    } else {
        throw new Error('Product could not be added.');
    }
};

const getProductsOf = async (sellerUsername: string, isMyProduct: boolean): Promise<Product[]> => {
    const querySpec = {
        query: isMyProduct
            ? 'SELECT * FROM c WHERE c.sellerUsername = @sellerUsername'
            : 'SELECT * FROM c WHERE c.sellerUsername != @sellerUsername',
        parameters: [
            {
                name: '@sellerUsername',
                value: sellerUsername,
            },
        ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (resources.length > 0) {
        // Use Promise.all to resolve all promises and get an array of Product objects
        const mappedProducts = await Promise.all(resources.map((product) => mapToProduct(product)));
        return mappedProducts;
    } else {
        throw new Error('Could not find products');
    }
};

const productExists = async (serialNumber: string): Promise<boolean> => {
    const { resource } = await container.item(serialNumber, serialNumber.substring(0, 3)).read();
    return !!resource;
};

const getProduct = async (serialNumber: string): Promise<Product> => {
    const s = serialNumber.substring(0, 3);
    const { resource } = await container.item(serialNumber, serialNumber.substring(0, 3)).read();
    if (resource) {
        return mapToProduct(resource);
    }
    throw new Error(`Product wuth serial number ${serialNumber} does not exist`);
};

export default {
    addProduct,
    getProductsOf,
    productExists,
    getProduct,
};
