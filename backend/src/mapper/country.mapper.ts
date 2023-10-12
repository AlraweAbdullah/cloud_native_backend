import { Country } from "../domain/model/country";
import { CountryPrisma } from "../util/db.server";

const mapToCountry = ({
    id,
    name,
}:  CountryPrisma): Country => Country.create(id, name)


const mapToCountries = (countryPrisma: CountryPrisma[]): Country[]  =>  countryPrisma.map(mapToCountry)

export {
    mapToCountry, mapToCountries
}