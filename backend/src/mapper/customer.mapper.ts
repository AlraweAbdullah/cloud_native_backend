import { ObjectId } from 'mongodb';
import { Customer } from '../domain/model/customer';
import { client } from '../util/db.server';

const mapToCustomer = async (customerId): Promise<Customer> => {
    const customersCollection = client.db(process.env.DATABASE).collection('customers');

    const customerDB = await customersCollection.findOne({
        _id: new ObjectId(customerId),
    });

    return new Customer({
        id: customerId,
        firstname: customerDB.firstname,
        lastname: customerDB.lastname,
        username: customerDB.username,
        password: customerDB.password,
        products: customerDB.product || [],
    });
};

export { mapToCustomer };
