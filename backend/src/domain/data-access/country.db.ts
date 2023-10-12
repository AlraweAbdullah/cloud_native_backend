import { Prisma, database } from "../../util/db.server";
import { mapToCountry, mapToCountries} from "../../mapper/country.mapper";
import { Country } from "../model/country";



const getCountryById = async ({id}: {id:number}) : Promise<Country> =>{
    const country = await database.country.findUnique({
        where :{id: id}
    })

    if(!country){
        throw new Error(`Country with id ${id} couldn't be found`)
    }

    return mapToCountry(country)
}

const getAllCountries = async () : Promise<Country[]> =>{
    const country = await database.country.findMany({
        orderBy:{
            id:"asc"
        }
    })

    return mapToCountries(country)
}

const updateCountry = async ({id, name}:{id:number,name:string}) : Promise<Country> =>{
    await getCountryById({id}) // Check if country exists by id 
    try{
        const country = await database.country.update({
                where: {
                    id
                },
                data: {
                    name
                },
        })
        return mapToCountry(country)

    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Country with name {${name}} already exists`) 
            }
        }
    }
   
}

export default {
    getCountryById,
    getAllCountries,
    updateCountry,
}
