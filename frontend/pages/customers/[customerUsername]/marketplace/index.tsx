import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

import ProductsOverview from '../../../../components/customers/marketplace/ProductsOverview';
import ProductService from '../../../../services/ProductService';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Product } from '../../../../types';
import { useRouter } from 'next/router';

const Sales: React.FC = () => {
    const [products, setProducts] = useState<Product[]>();
    const router = useRouter();

    const customerUsername = router.query.customerUsername as string;

    const getOtherProducts = async () => {
        ProductService.getProductsOf(customerUsername, false)
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
        if (router.isReady) {
            const sessionCustomer = JSON.parse(sessionStorage.getItem('user'));

            const customerUsername = router.query.customerUsername as string;

            if (!sessionCustomer) {
                router.push('/');
            } else if (customerUsername !== sessionCustomer.username) {
                router.push('/');
            }
            getOtherProducts();
        }
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>Marketplace</title>
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
