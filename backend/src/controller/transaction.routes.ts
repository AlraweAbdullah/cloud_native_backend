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
 *          customer:
 *            $ref: '#/components/schemas/Customer'
 *          product:
 *            $ref: '#/components/schemas/Product'
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
import express, { Request, Response } from 'express';
import transactionServer from '../service/transaction.service';
import type { TransactionInput } from '../types/types';
const transactionRouter = express.Router();

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

transactionRouter.post('/', async (req: Request, res: Response) => {
    const newTransaction = <TransactionInput>req.body;
    try {
        const product = await transactionServer.addtTransaction(newTransaction);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /transactions/{customerId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get transaction overview for a specific customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: The ID of the customer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction overview for the customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Error
 */

transactionRouter.get('/:customerId', async (req: Request, res: Response) => {
    const customerId = parseInt(req.params.customerId, 10);
    try {
        const transactionOverview = await transactionServer.getTransactionsOverview({ customerId });
        res.status(200).json(transactionOverview);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

export { transactionRouter };
