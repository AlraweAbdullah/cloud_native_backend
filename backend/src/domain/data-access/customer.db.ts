import { Customer } from "../model/customer";
import { database , Prisma} from "../../util/db.server";
import { mapToCustomer, mapToCustomers } from "../../mapper/customer.mapper";

const getAllCustomers = async (): Promise<Customer[]> => {
    const customers = await database.customer.findMany({
        include: {country:true}
    })
    return mapToCustomers(customers)
}

const getCustomerById = async ({id}: {id:number}) : Promise<Customer> =>{
    try{
        const customer = await database.customer.findUnique({
            where :{id: id},
            include: {country:true}
        })
        return mapToCustomer(customer)

    }catch(error){
        throw new Error(`Customer with id {${id}} couldn't be found`)
    }
}

const createCustomer = async ({name, lastname, username,password, country}:{name:string,lastname:string, username:string, password:string, country:string}): Promise<Customer> => {
    try {
        const customerPrisma = await database.customer.create({
            data:{
                name,
                lastname,
                username,
                password,
                country:{
                connectOrCreate:{
                    where:{
                        name:country
                    },
                    create:{
                        name:country
                    }
                }
               }
            }, 
            include:{country:true}
        })
        return mapToCustomer(customerPrisma)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Customer with name {${username}} already exists`) 
            }
        }
        throw new Error(error.message) 
    }

}

const getCustomerByUserName = async (username:string) : Promise<Customer>=> {
        const customerPrisma= await database.customer.findUnique({
            where:{
                username
            },
            include:{country:true}
        })

        if(customerPrisma){
            return mapToCustomer(customerPrisma)
        }
}


export default {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    getCustomerByUserName
}