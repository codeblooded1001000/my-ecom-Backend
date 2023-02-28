const signupRoutes = require("./src/signup/routes");
const productRoutes = require("./src/products/routes");
const cartRoutes = require('./src/cart/routes')
const checkoutRoute = require('./src/cart/checkout/routes');
const adminRoutes = require('./src/admin/routes')
const categoryRoutes = require('./src/productCategory/routes')

const router = {
    '/users': signupRoutes,
    '/products': productRoutes,
    '/carts': cartRoutes,
    '/checkout': checkoutRoute,
    '/admin': adminRoutes,
    '/categories': categoryRoutes
};
module.exports = router