const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    categoryName :{ type:String,  required: true, unique: true, trim: true }  
},
{
     versionKey: false,
     timestamps:true
});


const categoryModel = mongoose.model('category',categorySchema);


module.exports = categoryModel;