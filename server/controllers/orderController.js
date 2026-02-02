const orderService = require('../services/orderServices');
const orderValidator = require('../utils/validateOrder');
const genValidator = require('../utils/generalValidator');

const placeOrder = async (req,res) =>
{
    try
    {
        orderValidator.validateOrderPayload(req.body);
        const orderInfo = req.body;

        console.log("orderInfo:");
        console.log(orderInfo);
        const newOrder = await orderService.addOrder(orderInfo);
        return res.status(201).json({ok:true, orderData:newOrder,message:'Order placed successfully'});
    }
    catch(err)
    {
        console.log("ERROR:");
        console.log(err);
        return res.status(err.status || 500).json({
            ok: false,
            message: err.message,
            errorField: err.field,           
         });  
    }
}

const getUserOrders = async (req,res) =>
{
    try
    {
       const result = genValidator.validateMongoId('userId',req.params.userId);
        if (result)
        {
            return res.status(result.status).json({ok:false,orderData:null,message:result.message});
        }
        const userId = req.params.userId; 
        console.log("userId="+userId);
        const ordersInfo = await orderService.getUserOrders(userId);
        console.log("ordersInfo:");
        console.log(ordersInfo);
        if (!ordersInfo)
        {
              return res.status(404).json({ok:false,orderData:null,message: `The user ${userId} does not have any orders yet` });
        }
        return res.status(200).json({ok:true,orderData:ordersInfo,message:'Orders info returned successfully'});  
    }
    catch(err)
    {
        console.log(err);
        console.log(err);
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });     
    }    
}

const getUserProductQuantities = async (req,res) =>
{
    try
    {
         const result = genValidator.validateMongoId('userId',req.params.userId);
        if (result)
        {
            return res.status(result.status).json({ok:false,orderData:null,message:result.message});
        }
        const userId = req.params.userId; 
        productsInfo = await orderService.getUserProductQuantities(userId);
        if (!productsInfo)
        {
              return res.status(404).json({ok:false,orderData:null,message: `The user ${userId} does not have any products yet` });
        }
        return res.status(200).json({ok:true,orderData:productsInfo,message:'Products info returned successfully'});  
    }
    catch(err)
    {
        console.log(err);
        console.log(err);
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });     
    }
}

module.exports =
{
    placeOrder,
    getUserOrders,
    getUserProductQuantities 
}