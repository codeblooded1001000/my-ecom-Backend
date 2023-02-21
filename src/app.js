const express = require('express');
const mongoose = require("mongoose");
const signupRoutes = require("./signup/routes");
const productRoutes = require("./products/routes");
const cartRoutes =require('./cart/routes')
const checkoutRoute =require('./cart/checkout/routes');
const adminRoutes = require('./admin/routes')
const categoryRoutes = require('./productCategory/routes')
require('dotenv').config();
const app = express();
app.use(express.json());
const port = 3000 || process.env.PORT;

/********************************************* CONNECTED APPLICATION WITH THE DATABASE ******************************************/
mongoose.connect(
  process.env.URI_FOR_DB, 
  {
    useNewUrlParser: true,
   //useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

/********************************************* ROUTING ******************************************/
app.use('/users',signupRoutes);
app.use('/products',productRoutes);
app.use('/carts',cartRoutes);
app.use('/checkout',checkoutRoute);
app.use('/admin',adminRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Hello from E-mart Server!')
});


/********************************************* IF THE URL PROVIDED IS NOT CORRECT THEN THROW THESE ******************************************/
app.get('*', (req, res)=>{
  res.status(404).json({
    status: 404,
    message: "Page not found"
  })
})

app.post('*', (req, res)=>{
  res.status(404).json({
    status: 404,
    message: "Page not found"
  })
})

app.patch('*', (req, res)=>{
  res.status(404).json({
    status: 404,
    message: "Page not found"
  })
})

app.put('*', (req, res)=>{
  res.status(404).json({
    status: 404,
    message: "Page not found"
  })
})

app.delete('*', (req, res)=>{
  res.status(404).json({
    status: 404,
    message: "Page not found"
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
