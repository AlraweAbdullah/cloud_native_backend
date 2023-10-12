import { mapToTransaction } from "../../mapper/transaction.mapper"
import { database, Prisma} from "../../util/db.server"
import { Transaction } from "../model/transaction";

const addTransaction = async (
    {
        customerId,
        productId,
        quantity,
   
    }:
    {   
        customerId:number,
        productId:number,
        quantity:number,
   
    }
    
    ):Promise<Transaction> => {
    
    try {
        const date = new Date()
        const transactionPrisma = await database.transaction.create({
            data:{
                quantity,
                date,
                customer:{
                    connect:{id:customerId}
                },
                product:{
                    connect:{id:productId}
                }
            },
            include:{
                customer: {include:{country: true}},
                product:{include:{customer:{include:{country:true}}}}
            },
        });
        return mapToTransaction(transactionPrisma)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Buyer with id {${customerId}} already have product with name {${name}}`) 
            }
        }
        throw new Error(error.message) 
    }

}



export default {
    addTransaction
}