import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ProductsOverview from '../../components/products/ProductsOverview';
import ProductService from '../../services/ProductService';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Product } from '../../types';

const Sales: React.FC = () => {
    const [products, setProducts] = useState<Product[]>();

    const getCustomersProducts = async () => {
        ProductService.getProductsOf(JSON.parse(sessionStorage.getItem('user')).id, false)
            .then((res) => res.json())
            .then((products) => {
                if (products.status == 'error') {
                    console.log(products.errorMessage);
                } else {
                    setProducts(products);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getCustomersProducts();
    }, []);

    return (
        <>
            <Head>
                <title>Products</title>
            </Head>
            <Header></Header>

            <main>
                <section className="row justify-content-center min-vh-100">
                    <div className="col-6">
                        <h4>Products</h4>
                        <ProductsOverview products={products} />
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default Sales;
