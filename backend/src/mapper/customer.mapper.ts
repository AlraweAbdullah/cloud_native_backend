import { Customer } from "../domain/model/customer";
import { CustomerPrisma, CountryPrisma } from "../util/db.server";
import { mapToCountry } from "./country.mapper"


const mapToCustomer =({
    id,
    name,
    lastname,
    username, 
    password,
    country
}: CustomerPrisma &  {country: CountryPrisma}):
Customer => Customer.create(id,name, lastname, username, password, mapToCountry(country) )


const mapToCustomers = (customerPrisma: CustomerPrisma[]): Customer[]  =>
customerPrisma.map(mapToCustomer)

export {mapToCustomer, mapToCustomers}
