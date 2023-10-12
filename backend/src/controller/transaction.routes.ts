/**
* @swagger
*   components:
*    schemas:
*      Transaction:
*        type: object
*        properties:
*          id: 
*            type: number
*            format: int64
*          quantity: 
*            type: number
*            format: int64
*            description: Transaction's quantity
*          customerId:
*            type: number
*            formar: int64
*            description: Id of the buyer we should already have a buyer id to link the transaction to it
*            items: 
*               $ref: '#/components/schemas/Customer'
*          productId:
*            type: number
*            formar: int64
*            description: Id of the product we should already have a prudoct id to link the transaction to it
*            items: 
*               $ref: '#/components/schemas/Product'
*
*      TransactionInput:
*        type: object
*        properties:
*          quantity: 
*            type: number
*            format: int64
*            description: Transaction's quantity
*          customerId:
*            type: number
*            format: int64
*            description: Id of the customer we should already have abuyer id to link the transaction to it
*          productId:
*            type: number
*            format: int64
*            description: Id of the product we should already have a product id to link the transaction to it
*/
import express, {Request, Response} from "express"
import transactionServer from "../service/transaction.service"
import type { TransactionInput } from "../types/types"
const transactionRouter = express.Router()

/**
* @swagger
* /transactions:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Link a transaction to a product and a customer
*     requestBody: 
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/TransactionInput'
*     responses:
*       200:
*         description: The new transaction
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Transaction'
*       404:
*         description: Error
*/



transactionRouter.post('/', async(req:Request, res: Response) => {
    const newTransaction = <TransactionInput>req.body
    try {
        const product = await transactionServer.addtTransaction(newTransaction)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({status: 'error', errorMessage: error.message})
    }
})


export {transactionRouter}