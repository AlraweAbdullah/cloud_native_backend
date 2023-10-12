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
*          country:
*            type: string 
*            description: Country of the customer
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
*          country: 
*            type: string
*            description: Customer name
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

import express, { Request, Response } from "express"
import customerService from "../service/customer.service"
import { CustomerInput, CustomerLoginInput } from "../types/types";
const customerRouter = express.Router()

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

customerRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const customerInput = <CustomerInput>req.body
        if (!customerInput.name || !customerInput.lastname || !customerInput.username || !customerInput.password || !customerInput.country ) {
            throw new Error("Please provide all fields")
        }
        const customer = await customerService.createCustomer(customerInput)
        res.status(200).json(customer)
    } catch (error) {
        res.status(500).json({ status: "error", errorMessage: error.message })
    }
})


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


customerRouter.post("/login", async(req:Request, res:Response) =>{
    try {
        const customerLoginInput = <CustomerLoginInput>req.body
        const token = await customerService.authenticate(customerLoginInput)
        res.status(200).json({message: "Authintication succesful", token})
    } catch (error) {
        res.status(401).json({status: "Unauthorized", errorMessage: error.message})
    }
})

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


export { customerRouter }