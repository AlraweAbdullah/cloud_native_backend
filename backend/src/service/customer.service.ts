import { Customer } from '../domain/model/customer';
import { CustomerCredintials, CustomerDocument } from '../types/types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import customerDB from '../domain/data-access/customer';

const genrateJwtToken = (username: string): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'Ecommerce' };
    try {
        return jwt.sign({ username }, process.env.JWT_SECRET, options);
    } catch (error) {
        throw new Error(error);
    }
};

const createCustomer = async (customer: CustomerDocument): Promise<Customer> => {
    if (await customerDB.customerExists(customer.username)) {
        throw new Error(`Customer with username ${customer.username} already exists`);
    }

    validateCustomer(customer);

    const hashedPassword = await bcrypt.hash(customer.password, 12);
    customer.password = hashedPassword;
    return await customerDB.createCustomer({ customer });
};

const validateCustomer = (customer: CustomerDocument) => {
    if (!customer.username || customer.username.length < 3) {
        throw new Error('Username must be minimum 3 charachters.');
    }

    if (!customer.firstname || customer.firstname.length < 5) {
        throw new Error('Firstname must be minimum 5 charachters.');
    }

    if (!customer.lastname || customer.lastname.length < 5) {
        throw new Error('Lastname must be minimum 5 charachters.');
    }

    if (!customer.password || customer.password.length < 3) {
        throw new Error('Password must be minimum 3 charachters.');
    }
};

const authenticate = async ({ username, password }: CustomerCredintials): Promise<string> => {
    const customer = await getCustomer(username);
    if (!customer) {
        throw new Error('Incorrect username');
    }
    const isValidPassword = await bcrypt.compare(password, customer.password);

    if (!isValidPassword) {
        throw new Error('Incorrect password');
    }

    return genrateJwtToken(username);
};

const getCustomer = async (username: string) => customerDB.getCustomer(username);

export default {
    createCustomer,
    authenticate,
    getCustomer,
};
