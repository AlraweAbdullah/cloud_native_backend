import React, { useState } from 'react';
import CustomerService from '../../services/CustomerService';
import StatusMessageParser from '../StatusMessageParser';
import { Button, Form } from 'react-bootstrap';
import { Customer } from '../../types';
import { useRouter } from 'next/router';

type Props = {};

const LoginForm: React.FC<Props> = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [statusMessage, setStatusMessage] = useState(null);
    const router = useRouter();

    const validate = (): boolean => {
        let isValid = true;
        setUsernameError('');
        setPasswordError('');

        setStatusMessage(null);

        if (!username && username.trim() === '') {
            setUsernameError("Username can't be empty");
            isValid = false;
        }

        if (!password && password.trim() === '') {
            setPasswordError("Password can't be empty");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        let response;
        const customer: Customer = {
            username,
            password,
        };
        response = await CustomerService.login(customer);

        const data = await response.json();

        if (response.status === 200) {
            setStatusMessage({
                type: 'success',
                message: `Welcome ${username}`,
            });
            const token = data.token;
            const user = data.user;

            const userJSON = JSON.stringify(user);

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', userJSON);
            setTimeout(() => {
                console.log(user);
                router.push('/');
            }, 1000);
        } else if (response.status === 401) {
            setStatusMessage({
                type: 'unauthorized',
                message: data.errorMessage,
            });
        } else {
            setStatusMessage({
                type: 'error',
                message: data.errorMessage,
            });
        }
    };

    return (
        <>
            <article className="my-form-container col-4">
                <h5>Log in</h5>
                <StatusMessageParser statusMessage={statusMessage} />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <Form.Control
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {usernameError && <div className="text-danger">{usernameError}</div>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                            id="password"
                            type="password"
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {passwordError && <div className="text-danger">{passwordError}</div>}
                        </Form.Text>
                    </Form.Group>
                    <Button variant="outline-primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </article>
        </>
    );
};

export default LoginForm;
