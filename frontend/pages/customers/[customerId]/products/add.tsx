import Head from 'next/head';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import AddProductForm from '../../../../components/products/AddProductFom';
import { useRouter } from 'next/router';

const AddProduct: React.FC = () => {
    const router = useRouter();
    const { customerId } = router.query;
    const customerIdNumber = customerId ? parseInt(customerId as string, 10) : null;

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>

            <Header></Header>
            <main className="vh-100">
                <h4 className="text-center">Add Product</h4>
                <section className="row justify-content-evenly">
                    <AddProductForm customerId={customerIdNumber} />
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default AddProduct;
