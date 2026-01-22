const orderService = require('../services/orderServices');
const orderValidator = require('../utils/validateOrder');

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





module.exports =
{
    placeOrder
}