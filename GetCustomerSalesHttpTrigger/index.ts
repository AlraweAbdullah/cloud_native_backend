import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import TransactionsService from "../service/transaction.service";
import { Transaction } from "../domain/model/transaction";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");

    const username: string = req.params.username;

    const transactions: Transaction[] =
      await TransactionsService.getSalesOverview(username);

    context.res = {
      body: { transactions },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
