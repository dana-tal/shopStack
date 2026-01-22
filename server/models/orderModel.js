const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
     userId : { type:mongoose.Schema.Types.ObjectId, ref:'user',required:true},
     total: { type:Number, required:true }
},{
     versionKey: false,
     timestamps:true
});


const orderModel = mongoose.model ('order', orderSchema);

module.exports = orderModel;