const productRepo = require('../repositories/productRepo');


const getAllProducts =  (filters={})=>
{
    return productRepo.getAllProducts(filters);   
}

const getProductById = (id) =>{
    return  productRepo.getProductById(id);
}

const addProduct = async (productObj) =>
{
     let newProd = await productRepo.addProduct(productObj);

     newProd = await newProd.populate("catId", "categoryName");
     return {
    ...newProd.toObject(),
     category:{ id: newProd.catId._id, categoryName: newProd.catId.categoryName }   
  };
}

const updateProduct = async ( id, productObj)=>{
    let updatedProd = await productRepo.updateProduct(id,productObj);
    updatedProd  = await updatedProd.populate("catId","categoryName");
     return {
    ...updatedProd.toObject(),
     category:{ id: updatedProd.catId._id, categoryName: updatedProd.catId.categoryName }   
  };

  // return productRepo.updateProduct(id,productObj);
}

const deleteProduct = (id) =>{
    return productRepo.deleteProduct(id);
}

const deleteProducts = (ids) =>
{
    return productRepo.deleteProducts(ids);
}

const productExists = (id)=>{
    return productRepo.productExists(id);
}


module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    productExists
}