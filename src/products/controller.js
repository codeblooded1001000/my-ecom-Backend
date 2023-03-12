/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const productModel = require("./models");
const { verifyToken } = require("../middlewares/auth");
const userModel = require("../signup/models");
const categoryModel = require("../productCategory/models");

/*********************************************************GET ALL PRODUCTS*********************************************************/
const getAll = async(req, res) => {
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
const addProducts = async(req, res) => {
    try {
        const newProduct = new productModel(req.body); // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
        newProduct.createdBy = req.user.email;
        await newProduct.save(); // SAVE METHOD TO SAVE PRODUCT IN DATABASE

        // BINDING PRODUCT TO CATEGORY DB
        await categoryModel.findOneAndUpdate({ categoryName: newProduct.category }, { $push: { products: newProduct } });
        return res.send(newProduct);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};
const addMultipleProducts = async(req, res) => {
    try {
        // const newProduct = new productModel(req.body.product); // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
        const {email} = req.user
        const reqProducts = req.body.products
        const productsToBeAdded = []

        reqProducts.map((reqProduct) => {
            productsToBeAdded.push({...reqProduct, createdBy: email })
        })

        await productModel.insertMany(productsToBeAdded)

        //BINDING PRODUCT TO CATEGORY DB
        for (i in productsToBeAdded) {
            await categoryModel.findOneAndUpdate({ categoryName: productsToBeAdded[i].category }, { $push: { products: productsToBeAdded[i] } });
        }

        return res.status(200).json({
            status: 200,
            message: "Following data inserted successfully",
            data: productsToBeAdded
        })

        // const userDetails = await userModel.find({ email: createdBy });
        // newProduct.createdBy = userDetails[0].name;
        // await newProduct.save(); // SAVE METHOD TO SAVE PRODUCT IN DATABASE

        // // find({ categoryName: newProduct.category })

        // console.log(productCategory);

        //return res.send(newProduct);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}
const updateProductById = async(req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findOne({ _id: productId });
        if(!product){
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Product Not found",
            })
        }
        const updatedBy = req.user.email;
        const userDetails = await userModel.findOne({ email: updatedBy });
        product.updatedBy = userDetails.name;
        await product.updateOne(req.body && {updatedBy});
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

module.exports = { addProducts, addMultipleProducts, updateProductById, getAll };