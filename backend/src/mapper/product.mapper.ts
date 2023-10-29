import { Product } from '../domain/model/product';

const mapToProduct = (cosmosDBProduct): Product => {
    return new Product({
        serialNumber: cosmosDBProduct.id,
        name: cosmosDBProduct.name,
        price: cosmosDBProduct.price,
        description: cosmosDBProduct.description,
        sellerUsername: cosmosDBProduct.sellerUsername,
    });
};

export { mapToProduct };
