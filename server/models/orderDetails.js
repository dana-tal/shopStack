const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
     orderId : { type:mongoose.Schema.Types.ObjectId, ref:'order',required:true},
     productId: { type:mongoose.Schema.Types.ObjectId, ref:'product',required:true},
     price: {type:Number, required:true},
     quantity: { type:Number, required:true },
     productTotal: { type:Number, required:true }
},{
     versionKey: false,
     timestamps:true
});


const orderDetailsModel = mongoose.model ('orderDetails', orderDetailsSchema);

module.exports = orderDetailsModel;