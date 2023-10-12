import { PrismaClient , Prisma} from '@prisma/client'

const database = new PrismaClient()


type CustomerPrisma = Prisma.CustomerGetPayload<{
    include:{country:true}
}>

type ProductPrisma = Prisma.ProductGetPayload<{
    include: {customer:{include:{country:true}}}
}>

type CountryPrisma = Prisma.CountryGetPayload<{

}>

type TransactionPrisma = Prisma.TransactionGetPayload<{
    include:{customer:{include:{country:true}}, product:{include:{customer:{include:{country:true}}}}}
}>



export { database, CustomerPrisma, ProductPrisma, CountryPrisma,Prisma, TransactionPrisma}