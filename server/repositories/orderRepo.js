const mongoose = require('mongoose');

const Order = require('../models/orderModel');
const OrderDetails = require('../models/orderDetails');


const addOrder = (orderObj) =>{
    const order = new Order (orderObj);
    return order.save();
}

const addOrderDetails =( productRow) =>{
    const orderDetails = new OrderDetails (productRow);
    return orderDetails.save();
}


const getProductsOrders = ()=>{

     return OrderDetails.aggregate([
    // Group by productId and sum quantities
    {
      $group: {
        _id: "$productId",
        totalSold: { $sum: "$quantity" }
      }
    },
    // Join with products collection to get product title
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    // Flatten the product array
    {
      $unwind: "$product"
    },
    // Project only necessary fields
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productTitle: "$product.title",
        totalSold: 1
      }
    },
    // Sort by totalSold descending
    {
      $sort: { totalSold: -1 }
    }
  ]);

} 


const getUserOrderedProducts =(userId) => {
    return OrderDetails.aggregate([
        {
            $lookup: {
                from: "orders",
                localField: "orderId",
                foreignField: "_id",
                as: "order"
            }
        },
        { $unwind: "$order" },
        { $match: { "order.userId": new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product"
            }
        },
        { $unwind: "$product" },
        {
            $project: {
                _id: 0,
                id: "$_id",
                productName: "$product.title",
                quantity: "$quantity",
                total: "$productTotal",
                orderDate: "$order.createdAt"
            }
        },
        { $sort: { orderDate: -1 } }
    ]);
    
}



const getUserOrders = (userId) =>{
         return Order.aggregate([
    // 1. Filter orders by userId
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },

    // 2. Join orderDetails
    {
      $lookup: {
        from: "orderdetails", // collection name (plural, lowercase)
        localField: "_id",
        foreignField: "orderId",
        as: "items",
      },
    },

    // 3. Flatten items array
    {
      $unwind: "$items",
    },

    // 4. Join products
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },

    // 5. Flatten product array
    {
      $unwind: "$product",
    },

    // 6. Group back by order
    {
      $group: {
        _id: "$_id",
        total: { $first: "$total" },
        createdAt: { $first: "$createdAt" },
        items: {
          $push: {
            productId: "$product._id",
            productTitle: "$product.title",
            quantity: "$items.quantity",
            productTotal: "$items.productTotal",
          },
        },
      },
    },

    // 7. Sort orders (optional)
    {
      $sort: { createdAt: -1 },
    },
  ]);
}


module.exports ={
     addOrder,
     addOrderDetails,
     getUserOrders,
     getProductsOrders,
     getUserOrderedProducts
}