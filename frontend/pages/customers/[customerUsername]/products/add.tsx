import Head from 'next/head';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import AddProductForm from '../../../../components/customers/products/AddProductFom';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AddProduct: React.FC = () => {
    const router = useRouter();
    const [customerUsername, setCustomerUsername] = useState('');

    useEffect(() => {
        // Check if router is ready before accessing the query parameter
        if (router.isReady) {
            const customerUsername = router.query.customerUsername as string;
            setCustomerUsername(customerUsername);
        }
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>

            <Header />
            <main className="vh-100">
                <h4 className="text-center">Add Product</h4>
                <section className="row justify-content-evenly">
                    <AddProductForm customerUsername={customerUsername} />
                </section>
            </main>
            <Footer />
        </>
    );
};

export default AddProduct;
