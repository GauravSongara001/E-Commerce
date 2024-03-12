const express = require('express');
const router = express.Router();
const User = require('../controllers/userController');
const auth = require('../auth/authenticate')
const stripe = require('stripe')('sk_test_51OogpwSAQZs9DBpJEd4WGypvTwbANIg7DyE2AvjHQQMEqlSRu2zMgnwBysj0TuXP2Yj59e9iDTEcrnLrlMj7yLuc00F2wWoHbJ');

router.get('/cart', auth.authenticate, User.getUserCartData)
router.post('/register', User.registerUser)
router.post('/practice/login', User.loginUser)
router.get('/products/list', User.getProducts)
router.get('/product/getsingleproduct', User.getProductDetails)
router.post('/addtocart', auth.authenticate, User.addProductToCart)
router.post('/deleteItemFromCart', User.deleteItemFromCart)
router.post('/clearCart', User.clearCartData)
router.get('/getorders', auth.authenticate, User.getOrdersData)

router.post('/create-checkout-session', async (req, res) => {

    let cartData = req.body.cartList.map((el) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: el.productID.title
            },
            unit_amount: el.productID.price * 100
        },
        quantity: el.quantity
    }))
  
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartData,
        mode: 'payment',
        success_url: 'http://localhost:5173/success',
        cancel_url: 'http://localhost:5173/fail',
    });
    
    res.json({ id: session.id });
  });


module.exports = router;