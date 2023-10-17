import { Customer } from '../domain/model/customer';
import { CustomerInput, CustomerLoginInput } from '../types/types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import customerDB from '../domain/data-access/customer.db';

const jwtSecret = process.env.JWT_SECRET;

const genrateJwtToken = (username: string): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'Ecommerce' };
    try {
        return jwt.sign({ username }, jwtSecret, options);
    } catch (error) {
        throw new Error('Error genrating JWT token');
    }
};

const getAllCustomers = async (): Promise<Customer[]> => await customerDB.getAllCustomers();

const getCustomerById = async ({ id }: { id: number }): Promise<Customer> =>
    await customerDB.getCustomerById({ id: id });

const createCustomer = async ({
    firstname,
    lastname,
    password,
    username,
}: CustomerInput): Promise<Customer> => {
    const existingUser = await customerDB.getCustomerByUserName(username);
    if (existingUser) {
        throw new Error('Customer already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return await customerDB.createCustomer({
        firstname,
        lastname,
        username,
        password: hashedPassword,
    });
};

const authenticate = async ({ username, password }: CustomerLoginInput): Promise<string> => {
    const customer = await getCustomerByUserName(username);
    if (!customer) {
        throw new Error("Customer couldn't be found");
    }
    const isValidPassword = await bcrypt.compare(password, customer.password);

    if (!isValidPassword) {
        throw new Error('Incorrect password');
    }

    return genrateJwtToken(username);
};

const getCustomerByUserName = async (username: string) =>
    customerDB.getCustomerByUserName(username);
export default {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    authenticate,
    getCustomerByUserName,
};
