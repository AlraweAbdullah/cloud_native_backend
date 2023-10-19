/**
 * @swagger
 *   components:
 *    schemas:
 *      Customer:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: int64
 *          name:
 *            type: string
 *            description: Customer name
 *          products:
 *            type: array
 *            description: List of all the products of the customer
 *            items:
 *               $ref: '#/components/schemas/Product'
 *
 *      CustomerInput:
 *        type: object
 *        properties:
 *          firstname:
 *            type: string
 *            description: Customer name
 *          lastname:
 *            type: string
 *            description: Customer lastname
 *          username:
 *            type: string
 *            description: Customer username(unique)
 *          password:
 *            type: string
 *            description: Customer password
 *      CustomerLoginInput:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *            description: Customer username(unique)
 *          password:
 *            type: string
 *            description: Customer password
 *
 */

import express, { Request, Response } from 'express';
import customerService from '../service/customer.service';
import { CustomerInput, CustomerLoginInput } from '../types/types';
const customerRouter = express.Router();

/**
 * @swagger
 * /customers/signup:
 *   post:
 *     summary: Customer sign up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       200:
 *         description: The new customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               status: 'error'
 *               errorMessage: 'Please provide all fields'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 'error'
 *               errorMessage: 'Internal server error'
 */

customerRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const customerInput = <CustomerInput>req.body;
        if (
            !customerInput.firstname ||
            !customerInput.lastname ||
            !customerInput.username ||
            !customerInput.password
        ) {
            res.status(400).json({ status: 'error', errorMessage: 'Please provide all fields' });
        } else {
            const customer = await customerService.createCustomer(customerInput);
            res.status(200).json(customer);
        }
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /customers/login:
 *   post:
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerLoginInput'
 *     responses:
 *       200:
 *         description: The logged customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Error
 */

customerRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const customerLoginInput = <CustomerLoginInput>req.body;
        const token = await customerService.authenticate(customerLoginInput);
        const user = await customerService.getCustomerByUserName(customerLoginInput.username);
        res.status(200).json({ message: 'Authintication succesful', token, user });
    } catch (error) {
        res.status(401).json({ status: 'Unauthorized', errorMessage: error.message });
    }
});

export { customerRouter };
