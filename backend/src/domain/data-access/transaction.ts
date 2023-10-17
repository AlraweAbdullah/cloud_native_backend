import { mapToTransaction, mapToTransactions } from '../../mapper/transaction.mapper';
import { database, Prisma } from '../../util/db.server';
import { Transaction } from '../model/transaction';

const addTransaction = async ({
    customerId,
    productId,
    quantity,
}: {
    customerId: number;
    productId: number;
    quantity: number;
}): Promise<Transaction> => {
    try {
        const date = new Date();
        const transactionPrisma = await database.transaction.create({
            data: {
                quantity,
                date,
                customer: {
                    connect: { id: customerId },
                },
                product: {
                    connect: { id: productId },
                },
            },
            include: {
                customer: { include: { products: true } },
                product: { include: { customer: true } },
            },
        });
        return mapToTransaction(transactionPrisma);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(
                    `Buyer with id {${customerId}} already have product with name {${name}}`
                );
            }
        }
        throw new Error(error.message);
    }
};

const getTransactionsOverview = async (customerId): Promise<Transaction[]> => {
    try {
        const transactionPrisma = await database.transaction.findMany({
            where: {
                product: {
                    customerId,
                },
            },
            include: {
                customer: { include: { products: true } },
                product: { include: { customer: true } },
            },
        });
        return mapToTransactions(transactionPrisma);
    } catch (error) {
        throw new Error(error.message);
    }
};
export default {
    addTransaction,
    getTransactionsOverview,
};
