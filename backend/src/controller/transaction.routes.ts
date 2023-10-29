/**
 * @swagger
 *   components:
 *    schemas:
 *      Transaction:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          buyerUsername:
 *            type: string
 *          productSerialNumber:
 *             type: string
 *          quantity:
 *            type: number
 *            format: int64
 *            description: Transaction's quantity
 *          sellerUsername:
 *            type: string
 *
 *      TransactionInput:
 *        type: object
 *        properties:
 *          quantity:
 *            type: number
 *            format: int64
 *            description: Transaction's quantity
 *          buyerUsername:
 *            type: string
 *            description: username of the buyer we should already have abuyer id to link the transaction to it
 *          productSerialNumber:
 *            type: string
 *            description: SerialNumber of the product we should already have a product  to link the transaction to it
 */
import express, { Request, Response } from 'express';
import transactionServer from '../service/transaction.service';
import type { TransactionDocument } from '../types/types';
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
    const newTransaction = <TransactionDocument>req.body;
    try {
        const transaction = await transactionServer.addtTransaction(newTransaction);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /transactions/{sellerUsername}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get transaction overview for a specific customer
 *     parameters:
 *       - in: path
 *         name: sellerUsername
 *         required: true
 *         description: The username of the seller
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction overview for the seller
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Error
 */

transactionRouter.get('/:sellerUsername', async (req: Request, res: Response) => {
    const sellerUsername = req.params.sellerUsername;
    try {
        const transactionOverview = await transactionServer.getTransactionsOverview(sellerUsername);
        res.status(200).json(transactionOverview);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

export { transactionRouter };
