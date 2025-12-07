const genValidator = require('../utils/generalValidator');


const validateProductPayload = (req,res) =>
{
    let result = null;    
    const productObj = req.body;

    result = genValidator.validateTitle('Product',productObj.title,2,80);
    if (result)
    {
        return res.status(result.status).json({ok:false, errorField:'title', message:result.message});
    }
    result = genValidator.validatePositiveNumber('Price',productObj.price);
    if (result)
    {
        return res.status(result.status).json({ok:false, errorField:'price', message:result.message});
    }
    result = genValidator.validateMongoId('catId',productObj.catId);
    if (result)
    {
        return res.status(result.status).json({ok:false, errorField:'catId', message:result.message});
    }
    result = genValidator.validateImageUrl('imageUrl',productObj.imageUrl);
    if (result)
    {
        return res.status(result.status).json({ok:false, errorField:'imageUrl', message:result.message});
    }
    result = genValidator.validateDescription('Product',productObj.description,5,1000);
    if (result)
    {
         return res.status(result.status).json({ok:false, errorField:'description', message:result.message});
    }
    
}

module.exports = {
  validateProductPayload
}
