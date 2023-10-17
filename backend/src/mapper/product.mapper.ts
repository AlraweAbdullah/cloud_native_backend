import { Product } from '../domain/model/product';
import { ProductPrisma } from '../util/db.server';

const mapToProduct = (productPrisma: ProductPrisma): Product => {
    return new Product({
        id: productPrisma.id,
        name: productPrisma.name,
        price: productPrisma.price,
        description: productPrisma.description,
    });
};

const mapToProducts = (productPrismas: ProductPrisma[]): Product[] => {
    return productPrismas.map(mapToProduct);
};

export { mapToProduct, mapToProducts };
