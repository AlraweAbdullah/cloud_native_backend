import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import TransactionsService from "../service/transaction.service";
import { Transaction } from "../domain/model/transaction";
import { TransactionInput } from "../types/types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");

    const transactionInput: TransactionInput = req.body;
    const transaction: Transaction = await TransactionsService.addtTransaction(
      transactionInput
    );

    context.res = {
      body: { transaction },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
