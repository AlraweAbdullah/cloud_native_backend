import { Country } from "../domain/model/country"
import countryDB from "../domain/data-access/country.db"
import { CountryInput } from "../types/types";

const getAllCountries = async(): Promise<Country[]> => await countryDB.getAllCountries();


const getCountryById = async ({id}: {id: number}) : Promise<Country> => await countryDB.getCountryById({id:id})

const updateCountry = async ({id, name}: CountryInput) : Promise<Country> => await countryDB.updateCountry({id, name}) 


export default {
    getAllCountries,
    getCountryById,
    updateCountry
}