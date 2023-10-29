import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoginForm from '../../components/authentication/LoginForm';

const Login: React.FC = () => {
    return (
        <>
            <Head>
                <title>Log In</title>
            </Head>

            <Header></Header>
            <main className="vh-100">
                <h4 className="text-center">Log In</h4>
                <section className="row justify-content-evenly">
                    <LoginForm />
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default Login;
