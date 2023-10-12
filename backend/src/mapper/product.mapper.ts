import { Product } from "../domain/model/product"
import { ProductPrisma } from "../util/db.server"
import { mapToCustomer } from "./customer.mapper"

const mapToProduct =({
   id,
   name,
   price,
   stock,
   description,
   customer
}: ProductPrisma):
Product => Product.create(id, name,price, stock, description, mapToCustomer(customer))
 
    

const mapToProducts = (productPrisma: ProductPrisma[]): Product[]  => {
   return productPrisma.map(mapToProduct)

}

export  {
    mapToProduct, mapToProducts
}