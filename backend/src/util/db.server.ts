import { PrismaClient, Prisma } from '@prisma/client';

const database = new PrismaClient();

type CustomerPrisma = Prisma.CustomerGetPayload<{
    include: { products: true };
}>;

type ProductPrisma = Prisma.ProductGetPayload<{}>;

type TransactionPrisma = Prisma.TransactionGetPayload<{
    include: {
        customer: { include: { products: true } };
        product: { include: { customer: true } };
    };
}>;

export { database, CustomerPrisma, ProductPrisma, Prisma, TransactionPrisma };
