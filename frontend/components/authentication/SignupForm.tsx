import React, { useState } from 'react';
import CustomerService from '../../services/CustomerService';
import StatusMessageParser from '../StatusMessageParser';
import { Button, Form } from 'react-bootstrap';
import { Customer } from '../../types';
import { useRouter } from 'next/router';

const SignupForm: React.FC = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [statusMessage, setStatusMessage] = useState(null);
    const router = useRouter();

    const validate = (): boolean => {
        let isValid = true;
        setFirstnameError('');
        setLastnameError('');
        setUsernameError('');
        setPasswordError('');

        setStatusMessage(null);

        if (!firstname && firstname.trim() === '') {
            setFirstnameError("First name can't be empty");
            isValid = false;
        }

        if (!lastname && lastname.trim() === '') {
            setLastnameError("Last name can't be empty");
            isValid = false;
        }

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
            firstname,
            lastname,
        };
        response = await CustomerService.signup(customer);

        const data = await response.json();

        if (response.status === 200) {
            setStatusMessage({
                type: 'success',
                message: `Registration successful. Please log in.`,
            });
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else {
            setStatusMessage({
                type: 'bad_request',
                message: data.errorMessage,
            });
        }
    };

    return (
        <>
            <article className="my-form-container col-4">
                <h5>Sign Up</h5>
                <StatusMessageParser statusMessage={statusMessage} />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="firstname">First Name</Form.Label>
                        <Form.Control
                            id="firstname"
                            type="text"
                            value={firstname}
                            onChange={(event) => {
                                setFirstname(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {firstnameError && <div className="text-danger">{firstnameError}</div>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="lastname">Last Name</Form.Label>
                        <Form.Control
                            id="lastname"
                            type="text"
                            value={lastname}
                            onChange={(event) => {
                                setLastname(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {lastnameError && <div className="text-danger">{lastnameError}</div>}
                        </Form.Text>
                    </Form.Group>

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
                        Sign Up
                    </Button>
                </Form>
            </article>
        </>
    );
};

export default SignupForm;
