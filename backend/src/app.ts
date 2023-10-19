import * as dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { customerRouter } from './controller/customer.routes';
import { productRouter } from './controller/product.routes';
import { transactionRouter } from './controller/transaction.routes';

import { expressjwt } from 'express-jwt';
import { connectToMongoDB } from './util/db.server';

connectToMongoDB();
const app = express();
dotenv.config();

const port = process.env.APP_PORT || 3000;

const swaggerOpts: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce_api',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
const jwtSecret = process.env.JWT_SECRET;

app.use(
    expressjwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            /^\/api-docs\.*/,
            '/customers/signup',
            '/customers/login',
        ],
    })
);

app.use(cors());
app.use(bodyParser.json());

app.use('/customers', customerRouter);
app.use('/products', productRouter);
app.use('/transactions', transactionRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});

app.use((error, req, res, next) => {
    if (error.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', errorMessage: error.message });
    } else if (error.name === 'Error') {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    } else {
        next();
    }
});
