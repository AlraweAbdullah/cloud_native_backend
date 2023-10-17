import { useRouter } from 'next/router';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

import ProductsOverview from '../../../../components/customers/ProductsOverview';
import ProductService from '../../../../services/ProductService';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Product } from '../../../../types';

const CustomerProducts: React.FC = () => {
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>();
    const getCustomerProducts = async () => {
        const customerId = Number(router.query.customerId);

        ProductService.getProductsOf(customerId, true)
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
        const sessionCustomer = JSON.parse(sessionStorage.getItem('user'));

        if (router.isReady) {
            if (!sessionCustomer) {
                router.push('/');
            } else if (Number(router.query.customerId) !== sessionCustomer.id) {
                router.push('/');
            } else {
                getCustomerProducts();
            }
        }
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>My Products</title>
            </Head>
            <Header></Header>

            <main>
                <section className="row justify-content-center min-vh-100">
                    <div className="col-6">
                        <h4>My Products</h4>
                        <ProductsOverview products={products} />
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default CustomerProducts;
