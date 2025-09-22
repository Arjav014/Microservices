const Order = require("../model/Order");
const axios = require('axios');
const {publishMessage} = require('../utils/rabbitMQ');
const {sendOrderConfirmationEmail} = require('../utils/email');
// const Product = require("../../product-service/model/Product");

const placeOrder = async (req, res) => {
    const {products} = req.body;
    const userId = req.userId;
    try {
        let totalAmount = 0;
        const orderProducts = [];
        for(let i = 0; i < products.length; i++) {
            // const product = await Product.findById(products[i].productId);
            const response = await axios.get(`http://product-service:5678/api/products/${products[i].productId}`);
            const product = response.data;
            if(!product) {
                return res.status(404).json({message: 'Product not found'});
            }
            if(product.stock < products[i].quantity) {
                return res.status(400).json({message: `Insufficient stock for product ${product.name}`});
            }
            const price = product.price * products[i].quantity;
            totalAmount += price;
            orderProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                price: price
            });
        }
        const newOrder = new Order({
            userId,
            products: orderProducts,
            totalAmount
        });
        await newOrder.save();

        // Publish order to RabbitMQ

        await publishMessage('orderQueue', {
            orderId: newOrder._id,
            userId: newOrder.userId,
            products: newOrder.products,
            totalAmount: newOrder.totalAmount
        });

        // Get user email and send confirmation email
        try {
            const userResponse = await axios.get(`http://user-service:5001/api/auth/user/${userId}`, {
                headers: {
                    Authorization: req.headers.authorization // Pass the token
                }
            });
            const userEmail = userResponse.data.email;
            await sendOrderConfirmationEmail(userEmail, {
                orderId: newOrder._id,
                totalAmount: newOrder.totalAmount
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the order if email fails
        }

        res.status(201).json({message: 'Order placed successfully...', order: newOrder});
    } catch (error) {
        console.log("Error while placing order:",error);
        res.status(500).json({message: 'Failed to place order', error});
    }
}

module.exports = {placeOrder};