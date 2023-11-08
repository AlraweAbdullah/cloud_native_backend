import { Transaction } from "../domain/model/transaction";

const mapToTransaction = ({
  id,
  buyerUsername,
  productSerialNumber,
  quantity,
  sellerUsername,
  date,
}: {
  id: string;
  buyerUsername: string;
  productSerialNumber: string;
  sellerUsername: string;
  quantity: number;
  date: Date;
}): Transaction => {
  return new Transaction({
    id: id,
    buyerUsername: buyerUsername,
    productSerialNumber: productSerialNumber,
    quantity: quantity,
    date: date,
    sellerUsername: sellerUsername,
  });
};

export { mapToTransaction };
