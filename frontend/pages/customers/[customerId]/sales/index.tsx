import { useRouter } from 'next/router';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import SalesOverview from '../../../../components/sales/SalesOverview';
import TransactionService from '../../../../services/TransactionService';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Sale } from '../../../../types';

const CustomerSales: React.FC = () => {
    const router = useRouter();

    const [sales, setSales] = useState<Sale[]>();

    const getCustomerSales = async () => {
        const customerId = Number(router.query.customerId);

        TransactionService.getSales(customerId)
            .then((res) => res.json())
            .then((salesData) => {
                if (salesData.status == 'error') {
                    console.log(salesData.errorMessage);
                } else {
                    setSales(salesData);
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
                getCustomerSales();
            }
        }
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>My Sales</title>
            </Head>
            <Header></Header>

            <main>
                <section className="row justify-content-center min-vh-100">
                    <div className="col-6">
                        <h4>My Sales</h4>
                        <SalesOverview sales={sales} />
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default CustomerSales;
