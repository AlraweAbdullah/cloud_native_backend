import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";
import CustomerService from "../service/customer.service";
import { CustomerInput } from "../types/types";
import { Customer } from "../domain/model/customer";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await unauthenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");

    const customerInput: CustomerInput = req.body;
    const token = await CustomerService.authenticate(customerInput);

    const customer: Customer = await CustomerService.getCustomer(
      customerInput.username
    );

    context.res = {
      body: { customer, token },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
