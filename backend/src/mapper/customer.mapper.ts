import { Customer } from '../domain/model/customer';
import { CustomerPrisma } from '../util/db.server';
import { mapToProducts } from './product.mapper';

const mapToCustomer = (customerPrisma: CustomerPrisma): Customer => {
    return new Customer({
        id: customerPrisma.id,
        firstname: customerPrisma.firstname,
        lastname: customerPrisma.lastname,
        username: customerPrisma.username,
        password: customerPrisma.password,
        products: mapToProducts(customerPrisma.products),
    });
};
const mapToCustomers = (customerDataArray: any[]): Customer[] => {
    return customerDataArray.map((customerData) => mapToCustomer(customerData));
};

export { mapToCustomer, mapToCustomers };
