import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import ProductService from "../service/product.service";
import { Product } from "../domain/model/product";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");

    const username: string = req.params.username;
    const products: Product[] = await ProductService.getProducts(
      username,
      false
    );

    context.res = {
      body: { products },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
