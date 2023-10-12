import { mapToProduct, mapToProducts } from "../../mapper/product.mapper"
import { database, Prisma} from "../../util/db.server"
import { Product } from "../model/product"

const addProduct = async (
    {
        name,
        price,
        stock,
        description,
        customerId
    }:
    {   
        name:string,
        price:number,
        stock:number,
        description:string,
        customerId:number,
    }
    
    ):Promise<Product> => {
    
    try {
        const productPrisma = await database.product.create({
            data:{
                name,
                price,
                stock,
                description,
                customer:{
                    connect:{id:customerId}
                }
            },
            include:{
                customer: {include:{country: true}}
            },
        });
        return mapToProduct(productPrisma)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Seller with id {${customerId}} already have product with name {${name}}`) 
            }
        }
        throw new Error(error.message) 
    }

}

const getProductById = async ({id}: {id:number}) : Promise<Product> => {
    const product = await database.product.findUnique({
        where :{id: id},
        include:{
            customer: {include:{country: true}}

        }
    })

    if(!product){
        throw new Error(`Product with id {${id}} couldn't be found`)
    }

    return mapToProduct(product)
}

const getProductByName = async ({name}: {name:string}) : Promise<Product[] | Error> => {
    const products = await database.product.findMany({
        where :{
            name:name,
        },
        include:{
            customer: {include:{country: true}}

        }
    })

    const mapper = mapToProducts(products)
    if(mapper.length == 0){
        throw new Error(`Couldn't find name that contain {${name}}`)
    }else{
        return mapper
    }

}

const getAllProducts = async () : Promise<Product[]> =>{
    const products = await database.product.findMany({
        include:{
            customer: {include:{country: true}}
        }
    })
    return mapToProducts(products)
}

const deleteProductById = async ({id}: {id:number}) :  Promise<Product> => {
    await getProductById({id:id})  // Check if product exists by id
    const deleteProduct = await database.product.delete({
        where: {
          id: id,
        },include : {
            customer: {include:{country: true}}
        }
      })
      return mapToProduct(deleteProduct)
}

const updateProduct = async ({
    id,
    name,
    price,
    stock,
    description,
    customerId
}:{
    id:number
    name:string,
    price:number,
    stock:number,
    description:string,
    customerId:number
}):Promise<Product> => {
      try {
        const productPrisma = await database.product.update({
            where: {
              id:id
            },
            data: {
                name,
                price,
                stock,
                description
               
            },
            include:{
                customer: {include:{country: true}}
            }});
        return mapToProduct(productPrisma)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Seller with id {${customerId}} already have product with name {${name}}`) 
            }
        }
        throw new Error(error.message)     }
}

export default {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    getProductByName,
    updateProduct
}