import React, { useState } from 'react';
import { Product } from '../../types';

type Props = {
    products: Array<Product>;
};

const ProductsOverview: React.FC<Props> = ({ products }: Props) => {
    const [quantities, setQuantities] = useState<{ [productId: number]: number }>({});

    const handleQuantityChange = (productId: number, quantity: number) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: quantity,
        }));
    };

    const addToCart = (product: Product) => {
        const quantity = quantities[product.id] || 1;

        // Create a copy of the current cart or initialize it as an empty array
        const cart: { product: Product; quantity: number }[] =
            JSON.parse(sessionStorage.getItem('cart')) || [];

        let exist = false;

        cart.forEach((element) => {
            if (element.product.id === product.id) {
                exist = true;
                element.quantity += quantity;
            }
        });

        if (!exist) {
            cart.push({
                product: product,
                quantity: quantity,
            });
        }

        // Save the updated cart back to sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <div className="row">
            {products &&
                products.map((product, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card">
                            <img
                                src="https://loremflickr.com/320/240"
                                className="card-img-top"
                                alt="Product"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">Price: ${product.price}</p>
                                <p className="card-text">Description: {product.description}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                                <div>
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                product.id,
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                        value={quantities[product.id] || '1'}
                                        min={1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ProductsOverview;
