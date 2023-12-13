import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import ProductService from "../service/product.service";
import { Product } from "../domain/model/product";
import { ProductCache } from "../domain/data-access/redis-product-cash";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");

    const mapping = context.bindingData.mapping;
    const productCache = await ProductCache.getInstance();
    const cachedProducts = await productCache.getCachedProduct(mapping);

    if (cachedProducts) {
      // Return cached products with a 200 OK status
      context.res = {
        status: 200,
        body: { products: cachedProducts },
        headers: {
          "PRODUCTS-LOCATION": "cache"
        }
      };
    } else {
      const username: string = req.params.username;
      const products: Product[] = await ProductService.getProducts(
        username,
        true
      );

      // Cache products for future requests
      await productCache.cacheProduct(mapping, JSON.stringify(products));

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
