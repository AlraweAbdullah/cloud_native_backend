import { Transaction } from "../domain/model/transaction"
import { TransactionPrisma } from "../util/db.server"
import { mapToCustomer } from "./customer.mapper"
import { mapToProduct } from "./product.mapper"

const mapToTransaction =({
  id,
  customer,
  product,
  quantity,
  date
}: TransactionPrisma):
Transaction => Transaction.create(id, mapToCustomer(customer),mapToProduct(product),quantity, date)
 
    

const mapToTransactions = (transactionPrisma: TransactionPrisma[]): Transaction[]  => {
   return transactionPrisma.map(mapToTransaction)

}

export  {
    mapToTransaction, mapToTransactions
}