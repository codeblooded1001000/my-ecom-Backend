const express = require('express');
const mongoose = require("mongoose");
const signupRoutes = require("./signup/routes");
require('dotenv').config();
const app = express();
app.use(express.json());
const port = 3000;

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

app.use('/users',signupRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
