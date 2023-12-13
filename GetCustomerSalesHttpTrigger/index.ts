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

    const salesCache = await SalesCache.getInstance();
    const salesString = await salesCache.getCachedSales(username, cacheKey);

    if (salesString) {
      try {
        // Parse the string into a JavaScript object
        const sales: Transaction[] = JSON.parse(salesString);

        // Return cached sales with a 200 OK status
        context.res = {
          status: 200,
          body: { sales },
          headers: {
            "SALES-LOCATION": "cache"
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
      const sales: Transaction[] =
        await TransactionsService.getSalesOverview(username);

      // Cache saless for future requests
      await salesCache.cacheSales(username, cacheKey, JSON.stringify(sales));
      // Return fetched sales with a 200 OK status
      context.res = {
        status: 200,
        body: { sales },
        headers: {
          "SALES-LOCATION": "db"
        }
      };
    }

    // Close the connection to Redis
    await salesCache.quit();

  }, context);
};

export default httpTrigger;
