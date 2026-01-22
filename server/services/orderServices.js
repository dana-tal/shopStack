const orderRepo = require('../repositories/orderRepo');



const addOrder = async (orderInfo) =>{
    let newOrder = await orderRepo.addOrder({ userId:orderInfo.userId, total: orderInfo.total });
    const { _id, ...rest } = newOrder.toObject();    

    let total;

    for (const productEntry of orderInfo.products) 
    {
        total = productEntry.price * productEntry.quantity;
        await orderRepo.addOrderDetails({ orderId: newOrder._id, productId: productEntry.id ,price:productEntry.price,quantity: productEntry.quantity, productTotal: total});
    }
    return  { id: _id, ...rest };
}



module.exports = {
    addOrder
}
