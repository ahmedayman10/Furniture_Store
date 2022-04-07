const express = require('express');
const router = express.Router();
const {Order} = require('../models/order');
const {OrderItem} = require('../models/orderItem');
const orderValidation = require('../middlewares/validateOrderSchema')();

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("../middlewares/verifyToken");


router.get('/',verifyTokenAndAdmin,async(req, res)=>{
    const orders = await Order.find().populate('user','name').populate({
        path:'orderItems',populate:{path:'product',populate:'category'}}).sort('dateOrdered');
    if(!orders)return res.status(500).json({succes: false});
    res.send(orders);
});

//get all orders
router.get('/:id',verifyTokenAndAdmin,async(req, res)=>{
    try{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{path:'product',populate:'category'}})
    
    res.send(order);
    }catch(ex){
        res.status(400).send('order not exists');
    }
});

//post order
router.post('/',orderValidation,async (req,res)=>{
    
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.json({order:order});
})



//get total sales
router.get('/get/totalsales',verifyTokenAndAdmin,async(req, res)=>{
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalsales:{$sum: '$totalPrice'}}}
    ])
    
    if(!totalSales)return res.status(400).send('the order sales cannot be generated');
    res.status(200).json({success: true , totalsales:totalSales.pop().totalsales});
});

router.get(`/get/count`, async (req, res) => {
    let orderCount = await Order.find();
    res.status(200).json({success:true, orderCount:orderCount.length});
  });

//get user's orders
router.get('/get/userorder/:userId',async(req, res)=>{
    const userOrdersList = await Order.find({user: req.params.userId}).populate({
        path:'orderItems',populate:{path:'product',populate:'category'}});
    
    if(!userOrdersList)return res.status(500).json({succes: false});
     res.send(userOrdersList);
})

//update order
router.patch('/:id',verifyTokenAndAdmin,async(req, res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{ new: true })
        // res.status(200).json({order: updatedOrder});
        res.status(200).send(updatedOrder);
    }catch(err){
        res.status(404).send('order is not exists');   
    }
});

//delete
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
        Order.findByIdAndRemove(req.params.id).then(async order=>{
            if(order){
                await order.orderItems.map(async orderItem=>{
                    await OrderItem.findByIdAndRemove(orderItem)
                })
                return res.status(200).json({success: true, order: order , message:'the order is deleted'});
            }else{
                return res.status(500).json({success: false, message:'the order is not exists'}); 
            }
        }).catch(err=>{
            return res.status(500).json({success: false, error:err});
        })
})
module.exports = router;
