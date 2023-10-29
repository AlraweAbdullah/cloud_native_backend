import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Nav: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const handleLogOut = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('cart');
        setUser(null);
    };

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem('user')));
    }, []);
    if (user != null) {
        return (
            <>
                <Link
                    href="/"
                    className={`link nav-link px-4 fs-5 ${router.pathname == '/' ? 'active' : ''}`}
                >
                    Home
                </Link>
                <Link
                    href={`/customers/${user.username}/products/add`}
                    className={`link nav-link px-4 fs-5 ${
                        router.pathname == '/customers/[customerUsername]/products/add'
                            ? 'active'
                            : ''
                    }`}
                >
                    Add Product
                </Link>
                <Link
                    href={`/customers/${user.username}/products`}
                    className={`link nav-link px-4 fs-5 ${
                        router.pathname == '/customers/[customerUsername]/products' ? 'active' : ''
                    }`}
                >
                    My Products
                </Link>
                <Link
                    href={`/customers/${user.username}/sales`}
                    className={`link nav-link px-4 fs-5 ${
                        router.pathname == '/customers/[customerUsername]/sales' ? 'active' : ''
                    }`}
                >
                    My Sales
                </Link>

                <Link
                    href={`/customers/${user.username}/marketplace`}
                    className={`link nav-link px-4 fs-5 ${
                        router.pathname == '/customers/[customerUsername]/marketplace'
                            ? 'active'
                            : ''
                    }`}
                >
                    Marketplace
                </Link>
                <Link
                    href={`/customers/${user.username}/cart`}
                    className={`link nav-link px-4 fs-5 ${
                        router.pathname == '/customers/[customerUsername]/cart' ? 'active' : ''
                    }`}
                >
                    Cart
                </Link>
                <Link onClick={handleLogOut} href="/login" className={'link nav-link px-4 fs-5'}>
                    Log Out
                </Link>
            </>
        );
    }

    return (
        <>
            <Link
                href="/"
                className={`link nav-link px-4 fs-5 ${router.pathname == '/' ? 'active' : ''}`}
            >
                Home
            </Link>

            <Link
                href="/login"
                className={`link nav-link px-4 fs-5 ${router.pathname == '/login' ? 'active' : ''}`}
            >
                Log In
            </Link>
            <Link
                href="/signup"
                className={`link nav-link px-4 fs-5 ${
                    router.pathname == '/signup' ? 'active' : ''
                }`}
            >
                Sign Up
            </Link>
        </>
    );
};

export default Nav;
