const productService = require('../services/productServices');
const genValidator = require('../utils/generalValidator');
const productValidator = require('../utils/validateProduct');


const getAllProducts = async (req,res) =>
{
    try
    {
        const products = await productService.getAllProducts();
        if (!products)
        {
             return res.status(204).json({ok:false,productData:null, message: 'The request was successful, but there are no products yet'});             
        }
        return res.status(200).json({ok:true,productData:products, message:'Products retrieved successfully'})
    }
    catch(err)
    {
        return res.status(500).json({
                ok: false,
                message: err.message                 
            });    
    }
}

const getProductById = async (req,res) =>
{
    try
    {
         const result = genValidator.validateMongoId('id',req.params.id);
        if (result)
        {
            return res.status(result.status).json({ok:false,prudcutData:null,message:result.message});
        }
        const id = req.params.id;
        const product = await productService.getProductById(id);
        if (!product) 
        {
            return res.status(404).json({ok:false,productData:null,message: `The product ${id} does not exist` });
        }
        return res.status(200).json({ok:true,productData:product,message:'Product info returned successfully'});  
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });     
    }
}




const addProduct = async (req,res) =>
{
    try
    {
        const result = productValidator.validateProductPayload(req,res);
        if (result)
        {
            return result;
        }
        const productObj = req.body;             
        const newProduct = await productService.addProduct(productObj);
        return res.status(201).json({ok:true, productData:newProduct,message:'Product added successfully'});
    }
    catch(err)
    {
        console.log("ERROR:");
        console.log(err);
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });    
    }
}

const updateProduct = async (req,res) =>
{
    try
    {
        const result = productValidator.validateProductPayload(req,res);
        if (result)
        {
            return result;
        }
        const id = req.params.id;        
        const productObj = req.body;
        const updatedProduct = await productService.updateProduct(id,productObj);
        return res.status(200).json({ok:true, productData:updatedProduct, message:'Product updated successfully '});
    }
    catch(err)
    {
        console.log("Error");
        console.log( err);
        return res.status(500).json({
                ok: false,
                message: err.message                 
            });     
    }
}


const deleteProducts = async (req,res) =>
{
    let result=null,i;
    try
    {
          const ids = req.body.ids;
          for (i=0; i<ids.length && result===null ;i++)
          {
              result = genValidator.validateMongoId('id',ids[i]);  
          }
          if (result)
          {
              return res.status(result.status).json({ok:false, pruductData:null, message:result.message});
          }

          const info = await productService.deleteProducts(ids);   
          return res.status(200).json({ ok:true, productData: info, message:'Products deleted successfully '});
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });   
    }
}

const deleteProduct = async (req,res) =>
{
    try
    {
        const result = genValidator.validateMongoId('id',req.params.id);
        if (result)
        {
            return res.status(result.status).json({ok:false,prudcutData:null,message:result.message});
        }
        const id = req.params.id;    
        const exists = await productService.productExists(id);
        if (!exists)
        {
            return res.status(404).json(`Product with id ${id} does not exist`);
        }
        const deletedProduct = await productService.deleteProduct(id);
        return res.status(200).json({ ok:true, productData:deletedProduct, message:'Product deleted successfully'});

    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });   
    }
}

module.exports =
{
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    getAllProducts,
    getProductById
}