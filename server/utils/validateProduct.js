const genValidator = require('../utils/generalValidator');



const validateProductPayload = (body) =>
{
    let result = null;    
    const productObj = body;

    result = genValidator.validateTitle('Product',productObj.title,2,80);
    if (result)
    {
        throw { status: result.status, field: 'title', message: result.message};       
    }
    result = genValidator.validatePositiveNumber('Price',productObj.price);
    if (result)
    {
         throw { status: result.status, field: 'price', message: result.message};  
    }
    result = genValidator.validateMongoId('catId',productObj.catId);
    if (result)
    {
        throw { status: result.status, field: 'catId', message: result.message}; 
    }
    result = genValidator.validateImageUrl('imageUrl',productObj.imageUrl);
    if (result)
    {
        throw { status: result.status, field: 'imageUrl', message: result.message}; 
    }
    result = genValidator.validateDescription('Product',productObj.description,5,1000);
    if (result)
    {
        throw { status: result.status, field: 'description', message: result.message}; 
    }
    
}

module.exports = {
  validateProductPayload
}
