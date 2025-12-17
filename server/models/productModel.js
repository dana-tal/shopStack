const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
      title :{ type:String, required:true ,unique:true, trim:true },
      price :{ type:Number, required:true },
      catId : { type:mongoose.Schema.Types.ObjectId, ref:'category',required:true},
      imageUrl: { 
                    type:String, required:true, unique:true, trim:true,
                    validate: { validator:  value => {
                                        try {
                                        new URL(value);
                                        return true;
                                        } catch {
                                        return false;
                                        } },
                                 message: "Invalid URL format"
                               } 
                },
      description: { type:String, required:true, trim:true },
       isActive: { type: Boolean, default: true } 
},{
     versionKey: false,
     timestamps:true
});


productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

const productModel = mongoose.model ('product', productSchema);

module.exports = productModel;

