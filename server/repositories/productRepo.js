const mongoose = require('mongoose');

const Product = require('../models/productModel');


const addProduct = ( productObj) =>{
       const product = new Product( productObj);
       return product.save();
}

const updateProduct = (id, productObj) =>
{
    return Product.findByIdAndUpdate( id, productObj, {new:true});  // new:true means - return the updated document. By default findByIdAndUpdate returns 
                                                                    // the document as it was before the update 
}

const deleteProduct = (productId) => {
  return  Product.findByIdAndDelete(productId);
};

const deleteProducts = (productIds) => {
  return Product.deleteMany({ _id: { $in: productIds } });
};

const getProductById = async (productId) => {
  
  if (!mongoose.Types.ObjectId.isValid(productId)) // Ensure productId is a valid ObjectId
  {
    throw new Error('Invalid product ID');
  }
  const result = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(productId) } }, 
    {
      $lookup: {
        from: "categories",       
        localField: "catId",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },  // category is an array, take the first element
    {
      $project: {
        id: "$_id",
        _id: 0,
        title: 1,
        price: 1,
        imageUrl: 1,
        description: 1,
        category: {
          id: "$category._id",
          categoryName: "$category.categoryName"
        }
      }
    }
  ]);

  // result is an array with 0 or 1 item
  return result[0] || null;
};

const getAllProducts = (filters={}) => {
  return Product.aggregate([
    { $match: filters },

    // Join category
    {
      $lookup: {
        from: "categories",
        localField: "catId",
        foreignField: "_id",
        as: "category"
      }
    },

    // Category is an array → take first element
    { $unwind: "$category" },

    // Reshape fields
    {
      $project: {
        // rename product _id
        id: "$_id",
        _id: 0,
        title: 1,
        price: 1,
        imageUrl: 1,
        description: 1,
        // rename category._id to category.id
        category: {
          id: "$category._id",
          categoryName: "$category.categoryName"
        }
      }
    }
  ]);
};


const productExists = (id) =>{
    return Product.exists({ _id: id}); 
}

module.exports ={
     addProduct,
     updateProduct,
     deleteProduct,
     deleteProducts,
     getProductById,
     getAllProducts,
     productExists
}