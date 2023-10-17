import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>

            <Header></Header>
            <main className="vh-100">
                <h4 className="text-center">Welocme</h4>
            </main>
            <Footer></Footer>
        </>
    );
};

export default Home;
