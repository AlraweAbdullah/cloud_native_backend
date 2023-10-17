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
 *          name:
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
 *       404:
 *         description: Error
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
            throw new Error('Please provide all fields');
        }
        const customer = await customerService.createCustomer(customerInput);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

// /**
// * @swagger
// * /customers:
// *   get:
// *     security:
// *       - bearerAuth: []
// *     summary: Get list of customers.
// *     responses:
// *       200:
// *         description: List of all customers
// *         content:
// *           application/json:
// *             schema:
// *               $ref: '#/components/schemas/Customer'
// *       404:
// *         description: Error
// *
// */
// customerRouter.get("/", async (req: Request, res: Response) => {
//     try {
//         const customers = await customerService.getAllCustomers();

//         res.status(200).json(customers)
//     } catch (error) {
//         res.status(500).json({ status: 'error', errorMessage: error.message })
//     }
// })

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

// /**
//  * @swagger
//  * /customers/{id}/products:
//  *   get:
//  *     summary: Retrieve products for a specific customer.
//  *     description: Get the products data for a specific customer based on their customer ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: integer
//  *         required: true
//  *         description: The customer's unique identifier.
//  *     responses:
//  *       200:
//  *         description: Products data for the customer.
//  *       404:
//  *         description: Error if the customer or products data is not found.
//  */

// customerRouter.get('/:id/products', async (req: Request, res: Response) => {
//   try {
//     const id: number = parseInt(req.params.id)
//     // Use the customerService or your data source to fetch products data for the customer
//     const products = await customerService.getCustomerProducts({id:id})

//     // Return the products data as a JSON response
//     res.status(200).json(products)
//   } catch (error) {
//     // Handle any errors and send an appropriate error response
//     res.status(500).json({ status: 'error', errorMessage: error.message })
//   }
// })

// /**
// * @swagger
// * /customers/{id}:
// *   get:
// *     security:
// *       - bearerAuth: []
// *     summary: Get an customer by id.
// *     responses:
// *       200:
// *         description: Returns an customer, if not then an error is returned
// *         content:
// *           application/json:
// *             schema:
// *                $ref: '#/components/schemas/Customer'
// *     parameters :
// *        - name: id
// *          in: path
// *          description: id of the customer
// *          required: true
// *          type: integer
// *          format: int64
// *
// */
// customerRouter.get("/:id", async (req: Request, res: Response) => {
//     try {
//         const id: number = parseInt(req.params.id)
//         const customer = await customerService.getCustomerById({ id: id });
//         res.status(200).json(customer)
//     } catch (error) {
//         res.status(500).json({ status: 'error', errorMessage: error.message })
//     }
// })

export { customerRouter };
