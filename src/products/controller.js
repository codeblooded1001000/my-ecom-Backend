/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const productModel = require("./models");
const { verifyToken } = require("../middlewares/auth");
const userModel = require("../signup/models");
const categoryModel = require("../productCategory/models");
const checkAdmin = async(token, res) => {
    let email = token.email;
    let user = await userModel.findOne({ email });
    return user.role === "ADMIN" ? true : false;
    if (!flag) {
        return res.status(403).json({
            status: 403,
            message: "You are not allowed to perform this operation",
        });
    }
};
/*********************************************************GET ALL PRODUCTS*********************************************************/
const getAll = async(req, res) => {
    const decodedToken = await verifyToken(req, res);
    let isAdmin = await checkAdmin(decodedToken, res); // CHECKS FOR THE ADMIN
    try {
        if (isAdmin) {
            const allProducts = await productModel.find();
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
        } else {
            return res.status(403).json({
                status: 403,
                message: "You are not allowed to perform this operation",
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
    const decodedToken = await verifyToken(req, res);
    await checkAdmin(decodedToken, res); // CHECKS FOR THE ADMIN
    try {
        const newProduct = new productModel(req.body); // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
        const createdBy = decodedToken.email;
        const userDetails = await userModel.find({ email: createdBy });
        newProduct.createdBy = userDetails[0].name;
        await newProduct.save(); // SAVE METHOD TO SAVE PRODUCT IN DATABASE

        // BINDING PRODUCT TO CATEGORY DB
        await categoryModel.findOneAndUpdate({ categoryName: newProduct.category }, { $push: { products: newProduct } });
        // find({ categoryName: newProduct.category })

        // console.log(productCategory);

        return res.send(newProduct);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};
const addMultipleProducts = async(req, res) => {

    const decodedToken = await verifyToken(req, res);
    let isAdmin = await checkAdmin(decodedToken, res); // CHECKS FOR THE ADMIN
    if (isAdmin === false) {
        return res.status(403).json({
            status: 403,
            message: "You are not allowed to perform this operation",
        });
    }
    try {
        // const newProduct = new productModel(req.body.product); // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY

        const userDetails = await userModel.find({ email: decodedToken.email });
        const creator = userDetails[0].name

        const reqProducts = req.body.products
        const productsToBeAdded = []

        reqProducts.map((reqProduct) => {
            productsToBeAdded.push({...reqProduct, createdBy: creator })
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
    const decodedToken = verifyToken(req, res);
    let flag = await checkAdmin(decodedToken, res); // CHECKS FOR THE ADMIN
    if (!flag) {
        return res.status(403).json({
            status: 403,
            message: "You are not allowed to perform this operation",
        });
    }
    try {
        const productId = req.params.id;
        const product = await productModel.find({ _id: productId });
        const updatedBy = decodedToken.email;
        const userDetails = await userModel.find({ email: updatedBy });
        product[0].updatedBy = userDetails[0].name;
        await product[0].updateOne(req.body);
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