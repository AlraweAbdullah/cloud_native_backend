import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupForm from '../../components/authentication/SignupForm';

const Signup: React.FC = () => {
    return (
        <>
            <Head>
                <title>Sign Up</title>
            </Head>

            <Header></Header>
            <main className="vh-100">
                <h4 className="text-center">Sign Up</h4>
                <section className="row justify-content-evenly">
                    <SignupForm />
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default Signup;
