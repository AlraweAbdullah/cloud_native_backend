import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import TransactionsService from "../service/transaction.service";
import { Transaction } from "../domain/model/transaction";
import { SalesCache } from "../domain/data-access/redis-sales-cache";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");


    const username: string = req.params.username;
    const mapping = context.bindingData.mapping;

    // Include the username in the cache key
    const cacheKey = `${username}_${mapping}`;

    const transactionCache = await SalesCache.getInstance();
    const transactionString = await transactionCache.getCachedSales(username, cacheKey);

    if (transactionString) {
      try {
        // Parse the string into a JavaScript object
        const transactions: Transaction[] = JSON.parse(transactionString);

        // Return cached sales with a 200 OK status
        context.res = {
          status: 200,
          body: { transactions },
          headers: {
            "TRANSACTIONS-LOCATION": "cache"
          }
        };
      } catch (error) {
        // Handle JSON parsing error
        context.log.error("Error parsing JSON from cache:", error);
        context.res = {
          status: 500,
          body: { error: "Internal Server Error" },
        };
      }
    } else {
      const transactions: Transaction[] =
        await TransactionsService.getSalesOverview(username);

      // Cache saless for future requests
      await transactionCache.cacheSales(username, cacheKey, JSON.stringify(transactions));
      // Return fetched sales with a 200 OK status
      context.res = {
        status: 200,
        body: { transactions },
        headers: {
          "TRANSACTIONS-LOCATION": "db"
        }
      };
    }

    // Close the connection to Redis
    await transactionCache.quit();

  }, context);
};

export default httpTrigger;
