const orderRepo = require('../repositories/orderRepo');
const productService = require('../services/productServices');


const addOrder = async (orderInfo) =>{
    let newOrder = await orderRepo.addOrder({ userId:orderInfo.userId, total: orderInfo.total });
    const { _id, ...rest } = newOrder.toObject();    

    let total;

    for (const productEntry of orderInfo.products) 
    {
        total = productEntry.price * productEntry.quantity;
        await orderRepo.addOrderDetails({ orderId: newOrder._id, productId: productEntry.id ,price:productEntry.price,quantity: productEntry.quantity, productTotal: total});
        await productService.sellProduct(productEntry.id,productEntry.quantity);
    }
    return  { id: _id, ...rest };
}

const getUserOrders = async (userId) =>{
    const userOrders = await orderRepo.getUserOrderedProducts(userId);
    return userOrders;
}

const getUserProductQuantities = async (userId) =>{
    const userProducts = await orderRepo.getUserProductQuantities(userId);
    return userProducts;
}


module.exports = {
    addOrder,
    getUserOrders,
    getUserProductQuantities
}
