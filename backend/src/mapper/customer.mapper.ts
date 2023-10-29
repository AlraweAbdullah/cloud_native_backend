import { Customer } from '../domain/model/customer';

const mapToCustomer = async (cosmosDbCustomer): Promise<Customer> => {
    return new Customer({
        username: cosmosDbCustomer.id,
        firstname: cosmosDbCustomer.firstname,
        lastname: cosmosDbCustomer.lastname,
        password: cosmosDbCustomer.password,
    });
};

export { mapToCustomer };
