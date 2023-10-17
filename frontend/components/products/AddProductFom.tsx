import React, { useState } from 'react';
import ProductService from '../../services/ProductService';
import StatusMessageParser from '../StatusMessageParser';
import { Button, Form } from 'react-bootstrap';
import { Product } from '../../types';
import { useRouter } from 'next/router';

interface AddProductFormProps {
    customerId: number;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ customerId }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const [statusMessage, setStatusMessage] = useState(null);
    const router = useRouter();

    const validate = (): boolean => {
        let isValid = true;
        setNameError('');
        setPriceError('');
        setDescriptionError('');

        setStatusMessage(null);

        if (!name || name.trim() === '') {
            setNameError("Product name can't be empty");
            isValid = false;
        }
        if (!price || !/^\d+$/.test(price)) {
            setPriceError('Please enter a valid price with digits only');
            isValid = false;
        }

        if (!description || description.trim() === '') {
            setDescriptionError("Description can't be empty");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        const product: Product = {
            name,
            price: parseInt(price),
            description: description.trim(),
            customerId,
        };

        const response = await ProductService.addProduct(product);

        if (response.status === 200) {
            setStatusMessage({
                type: 'success',
                message: 'Product added successfully.',
            });
            router.push(`/customers/${customerId}/products`);
        } else {
            const data = await response.json();
            setStatusMessage({
                type: 'bad_request',
                message: data.errorMessage,
            });
        }
    };

    return (
        <>
            <article className="my-form-container col-4">
                <h5>Add Product</h5>
                <StatusMessageParser statusMessage={statusMessage} />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="name">Product Name</Form.Label>
                        <Form.Control
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {nameError && <div className="text-danger">{nameError}</div>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="price">Price</Form.Label>
                        <Form.Control
                            id="price"
                            type="text" // You can use type="number" for numeric input
                            value={price}
                            onChange={(event) => {
                                setPrice(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {priceError && <div className="text-danger">{priceError}</div>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control
                            id="description"
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                            {descriptionError && (
                                <div className="text-danger">{descriptionError}</div>
                            )}
                        </Form.Text>
                    </Form.Group>

                    <Button variant="outline-primary" type="submit">
                        Add Product
                    </Button>
                </Form>
            </article>
        </>
    );
};

export default AddProductForm;
