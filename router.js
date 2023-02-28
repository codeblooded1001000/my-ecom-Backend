const signupRoutes = require("./src/signup/routes");
const productRoutes = require("./src/products/routes");
const cartRoutes = require('./src/cart/routes')
const checkoutRoute = require('./src/cart/checkout/routes');
const adminRoutes = require('./src/admin/routes')
const categoryRoutes = require('./src/productCategory/routes')

const router = {
    signupRoutes,
    productRoutes,
    cartRoutes,
    checkoutRoute,
    adminRoutes,
    categoryRoutes
};
module.exports = router