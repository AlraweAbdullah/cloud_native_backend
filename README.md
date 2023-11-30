# Team Of Three Cloud Native BackEnd
## Description
This project is a simple Node.js application designed for E-commerce purposes. It utilizes JSON Web Tokens (JWT) for secure authentication, connecting to a Cosmos database for data storage.

## Setup

### 1. Environment Variables
Create a `.env` file in the root of your project and add the following variables:

```dotenv
JWT_SECRET="WW91IHNwZW50IHRvIG11Y2ggdGltZSB0cnlpbmcgdG8gZGVjb2RlIHRoaXMgc3RyaW5nLg=="
JWT_EXPIRES_HOURS=8
DATABASE="EcommerceDB"

COSMOS_KEY="Your Cosmos Key"
COSMOS_ENDPOINT="Your Cosmos Endpoint"
COSMOS_DATABASE_NAME="Your Cosmos Database Name"

APP_PORT=3000
