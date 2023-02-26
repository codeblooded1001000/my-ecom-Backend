# E-mart

The E-mart Backend is a RESTful API built to support the E-mart online marketplace application.

## Features

* User authentication and authorization.

* CRUD operations.

* Orders management.

* Cart System.

* Discount Coupon Generation after every nth order made by the customer.

### Technology Stack

* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

* ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
* ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

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
$ npm run dev
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

## Demo




https://user-images.githubusercontent.com/110348583/217510610-827445d4-5d8d-41b6-b035-f117be55c7e9.mp4

