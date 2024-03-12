const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');

module.exports = {
    async getHomePage(req,res) {
        try {

            res.json({message: "Welcome " + req.user.name})
            
        } catch (error) {
            console.log("Error while get home: ", error.message);
        }
    },

    async registerUser(req,res) {
        try {
            let user = await mongoose.model("User").create(req.body);

            if (user instanceof Error) {
                res.status(400).send({
                    status: 'fail',
                    message: "Error while register User!!"
                })
            } else {
                res.status(200).send({
                    status: 'Success',
                    message: "User registered Successfully!!"
                })
            }

            
        } catch (error) {
            console.log("Error while add user ", error);
        }
    },

    async loginUser(req,res) {
        try {
            // console.log('req.body -----------: ', req.body);

            let user = await mongoose.model("User").findOne({email: req.body.email}).lean();

            if (user) {
                let isPassVerified = await bcrypt.compare(req.body.password, user.password);

                if (isPassVerified) {

                    const token = jwt.sign(user, "mynameisgauravsongarathesoftwaredeveloper");
                    res.json({
                        statusCode: 200,
                        status: "Login Success",
                        token: token,
                        userData: user
                    })                
                } else {
                    res.send({
                        statusCode: 400,
                        status: "fail",
                        message: "Invalid Credentials"
                    })
                }
            } else {
                res.send({
                    status: "fail",
                    message: "Invalid Credentials"
                })
            }
            
        } catch (error) {
            console.log("Error while login: ", error);
            res.status(400).send({
                status: "fail",
                message: error.message
            })
        }
    },

    async getProducts(req,res) {
        try {

            let products = await Product.find().lean();
            // console.log('products: ', products);
            if (products instanceof Error) {
                res.send({
                    statusCode: 404,
                    status: 'fail',
                    message: "Error while Get Products!!"
                })
            } else {
                res.send({
                    statusCode: 200,
                    status: 'success',
                    records: products
                })
            }
            
        } catch (error) {
            console.log("Error while get home: ", error.message);
            res.send({
                statusCode: 404,
                status: 'fail',
                message: "Error while Get Products!! " + error.message
            })
        }
    },

    async getProductDetails(req,res) {
        try {

            let productDetails = await Product.findOne({_id: req.query.id}).lean();
            // console.log('productDetails: ', productDetails);
            if (productDetails instanceof Error) {
                res.send({
                    statusCode: 404,
                    status: 'fail',
                    message: "Error while Get productDetails!!"
                })
            } else {
                res.send({
                    statusCode: 200,
                    status: 'success',
                    result: productDetails
                })
            }
            
        } catch (error) {
            console.log("Error while get home: ", error.message);
            res.send({
                statusCode: 404,
                status: 'fail',
                message: "Error while Get Products!! " + error.message
            })
        }
    },

    async getUserCartData(req,res) {
        try {

            let list = await Cart.find({userID: req.user._id}).populate('productID').lean();

            if (list instanceof Error) {
                res.send({
                    statusCode: 404,
                    status: 'fail',
                    message: "Error while Get Cart!! " + error.message
                })
                
            } else {
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    element.totalPrice = element.productID.price * element.quantity;                    
                }

                res.send({
                    statusCode: 200,
                    status: 'success',
                    result: list
                })
            }
            
        } catch (error) {
            console.log("Error while get home: ", error.message);
        }
    },

    async addProductToCart(req,res) {
        try {
            let obj = null;
            let data = req.body;

            let dataObj = {
                productID: data._id,
                userID: req.user._id,
                quantity: data.qty
            }

            let isProductExist = await Cart.findOne({userID: req.user._id, productID: data._id}).lean();

            if (isProductExist) {
                dataObj.quantity += isProductExist.quantity;
                // console.log('dataObj.quantity -----------------: ', dataObj.quantity);
                let updateCart = await Cart.findByIdAndUpdate({_id: isProductExist._id}, dataObj)
                // console.log('updateCart ---------------------: ', updateCart);

                if (updateCart instanceof Error) {
                    obj = {
                        statusCode: 404,
                        status: 'fail',
                        message: "Error while Update Product Quantity!! " + error.message
                    }
                } else {
                    obj = {
                        statusCode: 200,
                        status: 'success',
                        message: "Cart updated Successfully"
                    }
                }

            } else {
                let addProductToCart = await Cart.create(dataObj);
                // console.log('addProductToCart: ', addProductToCart);

                if (addProductToCart instanceof Error) {
                    obj = {
                        statusCode: 404,
                        status: 'fail',
                        message: "Error while Add Product!! " + error.message
                    }
                } else {
                    obj = {
                        statusCode: 200,
                        status: 'success',
                        message: "Product Added to Cart"
                    }
                }
            }

            res.send(obj)            
            
        } catch (error) {
            console.log("Error while get home: ", error.message);
        }
    },

    async deleteItemFromCart(req,res) {
        try {

            let deleteItem = await Cart.findByIdAndDelete(req.body._id);
            // console.log('deleteItem: ', deleteItem);
            res.send(deleteItem);
            
        } catch (error) {
            console.log("Error while deleteItemFromCart: ", error.message);
            res.send(error.message)
        }
    },

    async clearCartData(req,res) {
        try {
            let obj = null;
            let getOrderData = await Cart.find({userID: req.body.user._id});
            console.log('getOrderData -----------------: ', getOrderData);

            let clearCart = await Cart.deleteMany({userID: req.body.user._id});
            console.log('clearCart: ', clearCart);

            if (clearCart instanceof Error) {
                obj = {
                    statusCode: 400,
                    status: 'fail',
                    message: "Error while Clear cart!!!"
                }
            } else {
                if (getOrderData) {
                    let obj = {
                        userID: req.body.user._id,
                        paymentDate: new Date(),
                        paymentStatus: "SUCCESS",
                        paymentMethod: "Card",
                        products: [],
                    };

                    getOrderData.forEach(el => {
                        obj.products.push({
                            productID: el.productID,
                            quantity: el.quantity,
                            orderStatus: "PENDING"
                        })
                    })
                    console.log('obj ---------------: ', obj);
                    let createOrderHistory = await Order.create(obj)
                    console.log('createOrderHistory ------------: ', createOrderHistory);
                }
                
            }
            res.send(clearCart);
            
        } catch (error) {
            console.log("Error while deleteItemFromCart: ", error.message);
            res.send(error.message)
        }
    },

    async getOrdersData(req,res) {
        try {

            console.log(req.user);

            let orders = await Order.aggregate([
                {
                    $match: {
                        userID: new mongoose.Types.ObjectId(req.user._id),
                    },
                },
                {
                    $unwind: {
                        path: "$products",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        foreignField: "_id",
                        localField: "products.productID",
                        from: "products",
                        as: "Product",
                    }
                },
                {
                    $unwind: {
                        path: "$Product",
                        preserveNullAndEmptyArrays: true
                    }
                },
            ])

            
            if (orders) {
                for (let i = 0; i < orders.length; i++) {
                    const element = orders[i];
                    element.paymentDate = new Date(element.paymentDate).toLocaleString('en-gb', { timeZone: "Asia/Kolkata"});
                    element.totalPrice = element.products.quantity * element.Product.price 
                }
                res.send({
                    statusCode: 200,
                    result: orders
                })
            } else {
                res.send({
                    statusCode: 400,
                    result: null,
                    message: "Error while get orders!!"
                })
            }
            
        } catch (error) {
            console.log("Error while getOrdersData: ", error.message);
            res.send(error.message)
        }
    }
}