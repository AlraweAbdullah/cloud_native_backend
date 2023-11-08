import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import CustomerService from "../service/customer.service";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";
import { CustomerInput } from "../types/types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await unauthenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");

    const customer: CustomerInput = req.body;
    await CustomerService.createCustomer(customer);

    context.res = {
      status: 200,
      body: { customer },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
