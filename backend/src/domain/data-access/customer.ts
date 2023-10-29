import { CosmosClient } from '@azure/cosmos';
import { Customer } from '../model/customer';
import { mapToCustomer } from '../../mapper/customer.mapper';
import { CustomerDocument } from '../../types/types';

const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;

const cosmosClient = new CosmosClient({
    endpoint: cosmosEndpoint,
    key: cosmosKey,
});
const container = cosmosClient.database(databaseName).container('Customers');

const createCustomer = async ({ customer }: { customer: CustomerDocument }): Promise<Customer> => {
    const result = await container.items.create({
        id: customer.username,
        firstname: customer.firstname,
        lastname: customer.lastname,
        password: customer.password,
        partition: customer.username.substring(0, 3),
    });
    if (result && result.statusCode >= 200 && result.statusCode < 400) {
        return getCustomer(customer.username);
    } else {
        throw new Error('Customer could not be added.');
    }
};

const getCustomer = async (username: string): Promise<Customer> => {
    const { resource } = await container.item(username, username.substring(0, 3)).read();

    if (resource) {
        return mapToCustomer(resource);
    } else {
        throw new Error(`Customer with username ${username} could not be found.`);
    }
};
const customerExists = async (username: string): Promise<boolean> => {
    const { resource } = await container.item(username, username.substring(0, 3)).read();
    return !!resource;
};

export default {
    createCustomer,
    getCustomer,
    customerExists,
};
