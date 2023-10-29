/**
 * @swagger
 *   components:
 *    schemas:
 *      Product:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *            description: Product's name
 *          price:
 *            type: number
 *            format: int64
 *            description: Product's price
 *          description:
 *            type: string
 *            description: Product's description
 *          sellerUsername:
 *            type: string
 *            description: Username customer we should already have a customer to link the product to it

 *      ProductInput:
 *        type: object
 *        properties:
 *          serialNumber:
 *            type: string
 *            description: Product's serialNumber
 *          name:
 *            type: string
 *            description: Product's name
 *          price:
 *            type: number
 *            format: int64
 *            description: Product's price
 *          description:
 *            type: string
 *            description: Product's description
 *          sellerUsername:
 *            type: string
 *            description: Username of the customer we should already have a customer to link the product to it
 * 
 *
 *
 *
 */
import express, { Request, Response } from 'express';
import productService from '../service/product.service';
import type { ProductDocument } from '../types/types';
const productRouter = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Link a product to a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: The new product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Error
 */

productRouter.post('/', async (req: Request, res: Response) => {
    const newProduct = <ProductDocument>req.body;
    try {
        const product = await productService.addProduct(newProduct);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /products/{sellerUsername}/{isCustomerProducts}:
 *   get:
 *     summary: Retrieve products based on customer and isCustomerProducts flag.
 *     description: Get products data based on the customer ID and isCustomerProducts flag.
 *     parameters:
 *       - in: path
 *         name: sellerUsername
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer's unique identifier.
 *       - in: path
 *         name: isCustomerProducts
 *         schema:
 *           type: boolean
 *         required: true
 *         description: A flag to indicate whether to fetch customer's products or not.
 *     responses:
 *       200:
 *         description: Products data based on the path parameters.
 *       404:
 *         description: Error if the customer or products data is not found.
 */

productRouter.get('/:sellerUsername/:isCustomerProducts', async (req: Request, res: Response) => {
    try {
        const sellerUsername: string = req.params.sellerUsername;
        const isCustomerProducts: boolean = req.params.isCustomerProducts === 'true';

        const customerProducts = await productService.getProductsOf(
            sellerUsername,
            isCustomerProducts
        );
        res.status(200).json(customerProducts);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

export { productRouter };
