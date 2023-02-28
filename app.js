const express = require('express');
const mongoose = require("mongoose");
const router = require('./router.js')
require('dotenv').config();
const app = express();
app.use(express.json());
const port = process.env.PORT; //5000

/********************************************* CONNECTED APPLICATION WITH THE DATABASE ******************************************/
mongoose.connect(
    process.env.URI_FOR_DB, {
        useNewUrlParser: true,
        //useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("Connected successfully");
});

/********************************************* ROUTING ******************************************/

for (var route in router) {
  if (router.hasOwnProperty(route)) {
      app.use(route, router[route]);
  }
}

app.get('/', (req, res) => {
    res.send('Hello from E-mart Server!')
});

/********************************************* IF THE URL PROVIDED IS NOT CORRECT THEN THROW THESE ******************************************/
app.get('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.post('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.patch('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.put('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.delete('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
    // const signupRoutes = require("./src/signup/routes");
    // const productRoutes = require("./src/products/routes");
    // const cartRoutes = require('./src/cart/routes')
    // const checkoutRoute = require('./src/cart/checkout/routes');
    // const adminRoutes = require('./src/admin/routes')
    // const categoryRoutes = require('./src/productCategory/routes')