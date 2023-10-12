import { Customer } from "../domain/model/customer"
import costumerDB from "../domain/data-access/customer.db"
import { CustomerInput, CustomerLoginInput } from "../types/types";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import customerDb from "../domain/data-access/customer.db";

const jwtSecret = process.env.JWT_SECRET

const genrateJwtToken = (username: string):string => {
    const options = {expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: "Ecommerce"}
    try {
        return jwt.sign({username}, jwtSecret, options)
    } catch (error) {
        console.log(error)
        throw new Error("Error genrating JWT token")
    }
}

const getAllCustomers = async(): Promise<Customer[]> => await costumerDB.getAllCustomers();


const getCustomerById = async ({id}: {id: number}) : Promise<Customer> => await costumerDB.getCustomerById({id:id})

const createCustomer = async ({name,lastname, password, username,country}:CustomerInput): Promise<Customer> =>
{
    const existingUser = await costumerDB.getCustomerByUserName(username)
    if(existingUser){
        throw new Error("Customer already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    
    return await customerDb.createCustomer({name,lastname,username, password:hashedPassword,country})
}   

const authenticate = async ({username, password}:CustomerLoginInput) :Promise<string>=> {
    const customer = await getCustomerByUserName(username)
    if(!customer){
        throw new Error("Customer couldn't be found")
    }
    const isValidPassword = await bcrypt.compare(password, customer.password)

    if(!isValidPassword){
        throw new Error("Incorrect password")
    }

    return genrateJwtToken(username)
}



const getCustomerByUserName = async (username:string) => customerDb.getCustomerByUserName(username)
export default {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    authenticate
}