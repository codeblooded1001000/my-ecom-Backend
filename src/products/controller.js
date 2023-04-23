/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const productModel = require("./models");
const { verifyToken } = require("../middlewares/auth");
const userModel = require("../signup/models");
const categoryModel = require("../productCategory/models");
const mongoose = require("mongoose");
/*********************************************************GET ALL PRODUCTS*********************************************************/
const getAll = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    if (allProducts.length) {
      return res.status(200).json({
        status: 200,
        message: "success",
        data: allProducts,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No products found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
/***************************** ADD PRODUCTS FUNCTION, ONLY ADMIN IS AUTHORIZED TO PERFORM THIS OPERATION ***************************/
const addProducts = async (req, res) => {
  try {
    const newProduct = new productModel(req.body); // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
    newProduct.createdBy = req.user.email;
    await newProduct.save(); // SAVE METHOD TO SAVE PRODUCT IN DATABASE

    // BINDING PRODUCT TO CATEGORY DB
    await categoryModel.findByIdAndUpdate(newProduct.category, {
      $push: { products: newProduct },
    });
    return res.status(200).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
const addMultipleProducts = async (req, res) => {
  // ERROR IN THIS FUNCTION
  //   try {
  //     const { email } = req.user;
  //     const reqProducts = req.body.products;
  //     const productsToBeAdded = [];
  //     reqProducts.map((reqProduct) => {
  //       productsToBeAdded.push({ ...reqProduct, createdBy: email });
  //     });
  //     await productModel.insertMany(productsToBeAdded);
  //     //BINDING PRODUCT TO CATEGORY DB  <------------ THIS PART HAS ERROR
  //     productsToBeAdded.map(async (productToBeAdded) => {
  //       try {
  //         const result = await categoryModel.findByIdAndUpdate(
  //           productToBeAdded.category,
  //           {
  //             $push: { products: productToBeAdded },
  //           }
  //         );
  //         console.log("result ============>", result);
  //       } catch (error) {
  //         console.log(error);
  //         return res.status(500).json({
  //           status: 500,
  //           message: error.message,
  //         });
  //       }
  //     });
  //     return res.status(200).json({
  //       status: 200,
  //       message: "Following data inserted successfully",
  //       data: productsToBeAdded,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({
  //       status: 500,
  //       message: error.message,
  //     });
  //   }
};
const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Product Not found",
      });
    }
    const updatedBy = req.user.email;
    const userDetails = await userModel.findOne({ email: updatedBy });
    product.updatedBy = userDetails.name;
    await product.updateOne(req.body && { updatedBy });
    return res.status(200).json({
      status: 200,
      message: "Product Detail updated",
      updatedBy,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
    });
  }
};

/*********************************************************DANGER ZONE DO NOT ENTER**********************************************************/

// const emptyProductsDB = async (req, res) => {
//   const decodedToken = await verifyToken(req, res);
//   let isAdmin = await checkAdmin(decodedToken, res);
//   let name = req.body.name;

//   if (isAdmin === false) {
//     return res.status(403).json({
//       status: 403,
//       message: "You are not allowed to perform this operation",
//     });
//   }
//   try {
//     // console.log("this is inside promise body");
//     const x = await productModel.deleteMany({ filed1: "value" });
//     const y = await productModel.find();

//     if (y.length === 0) {
//       console.log(x, "after deletion");
//       return res.status(200).json({
//         status: 200,
//         message: "products deleted successfully",
//         result: x,
//       });
//     } else {
//       console.log("Error in else block");
//       return res.status(500).json({
//         status: 500,
//         message: "Something went wrong!",
//       });
//     }
//   } catch (error) {
//     console.log("Error in catch block");

//     return res.status(500).json({
//       status: 500,
//       message: "Something went wrong!",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  addProducts,
  addMultipleProducts,
  updateProductById,
  getAll,
  //   emptyProductsDB,
};
