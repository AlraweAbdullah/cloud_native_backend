import { Context } from "@azure/functions";
import { CustomError } from "../domain/model/custom-error";
import { Customer } from "../domain/model/customer";
import customerService from "../service/customer.service";

export const unauthenticatedRouteWrapper = async (
  handler: () => Promise<void>,
  context: Context
) => {
  try {
    if (context.req.headers.authorization) {
      throw CustomError.authenticated(
        "Must be unauthenticated to perform this action."
      );
    }
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
};

export const authenticatedRouteWrapper = async (
  handler: () => Promise<void>,
  context: Context
) => {
  try {
    const authorizationHeader = context.req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      // Handle cases where there is no valid authorization token
      throw CustomError.authenticated(
        "Must be authenticated with 'Bearer ' to perform this action."
      );
    }
    const token = authorizationHeader.slice(7); // Assuming "Bearer " prefix

    // Verify the token using  customer service
    await customerService.verifyToken(token);

    // If the token is valid, execute the handler
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
};

const errorHandler = (error: Error | CustomError, context: Context) => {
  if ((error as any).code) {
    const cError = error as CustomError;
    context.res = {
      body: { message: cError.message },
      status: cError.code,
      headers: {
        "Content-Type": "application/json",
      },
    };
  } else {
    context.res = {
      body: { message: (error as Error).message },
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
