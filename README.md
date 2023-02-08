# E-mart

The e_Mart Backend is a RESTful API built to support the e_Mart online marketplace application.

## Features

* User authentication and authorization.

* CRUD operations.

* Orders management.

* Cart System.

* Discount Coupon Generation after every nth order made by the customer.

### Technology Stack

* [Node.js](https://nodejs.org/en/download/)

* [MongoDB](https://docs.mongodb.com/manual/installation/)

* [Express.js](https://expressjs.com/)

* [npm](https://www.npmjs.com/)
* [JWT](https://jwt.io/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Clone the repository:

```shell
$ git clone https://github.com/codeblooded1001000/e_Mart-Backend.git
```
2. Install dependencies:

```shell
$ npm install
```

3. Start the application:
```shell
$ npm start
```
or

Move to the src directory by this command
```shell
$ cd src
```
and then run this

```shell
$ nodemon app.js
```

If this doesn't work out then run this command in the src directory.
```shell
$ npx nodemon app.js
```

4. Access the API at `http://localhost:3000/`
# Documentation

API documentation is available on this link [E-mart Docs](https://documenter.getpostman.com/view/24360292/2s935pr41m).
## API Endpoints

#### Users Endpoints

`POST users/signUp`: Register a user.

`POST users/login`: Login a user.

`PATCH users/updateUser/:id`: Update a user by User ID.

`GET users/getAll`: Fetch all the users from the database(Only the admin is authorized)

#### Products endpoints

`POST products/addProducts`: Add products in the database(Only the admin is authorized)

#### Cart Endpoints
`POST carts/addItemToCart?productID={:id}`: Add items to the cart 

#### Checkout Endpoints
`POST checkout/getPurchaseDetails`: Final checkout and get purchase details.

#### Admin Endpoints
`POST admin/generateDiscountCode`: Generate a unique discount coupon(Only the admin is authorized).

`GET admin/getTotalPurchaseDetails`: Get total purchase details i.e. count of items purchased, total purchase amount, list of discount codes and total discount amount(Only the admin is authorized).
