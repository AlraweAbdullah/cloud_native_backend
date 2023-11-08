import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { ProductInput } from "../types/types";
import productService from "../service/product.service";
import { Product } from "../domain/model/product";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");
    const productInput: ProductInput = req.body;
    const product: Product = await productService.addProduct(productInput);

    context.res = {
      body: { product },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
