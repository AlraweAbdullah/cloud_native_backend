import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import ProductService from "../service/product.service";
import { Product } from "../domain/model/product";
import { ProductCache } from "../domain/data-access/redis-product-cache";

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

    const productCache = await ProductCache.getInstance();
    const productsString = await productCache.getCachedProduct(username, cacheKey, false);

    if (productsString) {
      try {
        // Parse the string into a JavaScript object
        const products: Product[] = JSON.parse(productsString);

        // Return cached products with a 200 OK status
        context.res = {
          status: 200,
          body: { products },
          headers: {
            "PRODUCTS-LOCATION": "cache"
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
      const products: Product[] = await ProductService.getProducts(
        username,
        true
      );

      // Cache products for future requests
      await productCache.cacheProduct(username, cacheKey, JSON.stringify(products), false);
      // Return fetched products with a 200 OK status
      context.res = {
        status: 200,
        body: { products },
        headers: {
          "PRODUCTS-LOCATION": "db"
        }
      };
    }

    // Close the connection to Redis
    await productCache.quit();
  }, context);
};

export default httpTrigger;
