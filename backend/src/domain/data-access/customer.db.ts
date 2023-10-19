import { client } from '../../util/db.server';
import { Customer } from '../model/customer';
import { ObjectId } from 'mongodb';
// Call the connection function

const createCustomer = async ({
    firstname,
    lastname,
    username,
    password,
}: {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}): Promise<Customer> => {
    try {
        const customersCollection = client.db(process.env.DATABASE).collection('customers');
        const customer = {
            firstname,
            lastname,
            username,
            password,
        };

        const result = await customersCollection.insertOne(customer);
        if (result) {
            return getCustomerById(result.insertedId);
        }
    } catch (error) {
        console.error('Error creating customer', error);
    }
};

const getCustomerById = async (id: string): Promise<Customer> => {
    try {
        const customersCollection = client.db(process.env.DATABASE).collection('customers');
        const customer = await customersCollection.findOne({ _id: new ObjectId(id) });
        if (customer) {
            return new Customer({
                id: customer._id,
                firstname: customer.firstname,
                lastname: customer.lastname,
                username: customer.username,
                password: customer.password,
                products: customer.product || [],
            });
        } else {
            throw new Error(`Customer with ID ${id} couldn't be found`);
        }
    } catch (error) {
        throw new Error(`Error retrieving customer: ${error.message}`);
    }
};

const getCustomerByUserName = async (username: string): Promise<Customer> => {
    try {
        const customersCollection = client.db(process.env.DATABASE).collection('customers');
        const customer = await customersCollection.findOne({ username: username });

        if (customer) {
            return new Customer({
                id: customer._id,
                firstname: customer.firstname,
                lastname: customer.lastname,
                username: customer.username,
                password: customer.password,
                products: customer.product || [],
            });
        } else {
            throw new Error(`Customer with Username ${username} couldn't be found`);
        }
    } catch (error) {
        throw new Error(`Error retrieving customer: ${error.message}`);
    }
};

const isAlradyCustomer = async (username: string): Promise<Boolean> => {
    try {
        const customersCollection = client.db(process.env.DATABASE).collection('customers');
        const customer = await customersCollection.findOne({ username: username });

        return customer ? true : false;
    } catch (error) {
        throw new Error(`Error retrieving customer: ${error.message}`);
    }
};

export default {
    getCustomerById,
    createCustomer,
    isAlradyCustomer,
    getCustomerByUserName,
};
