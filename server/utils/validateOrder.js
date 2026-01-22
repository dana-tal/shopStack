const genValidator = require('../utils/generalValidator');

const validateOrderPayload = (body) =>
{
    let result = null;    
    const orderObj = body;

    result = genValidator.validateMongoId('UserId',orderObj.userId);
    if (result)
    {
        throw { status: result.status, field: 'userId', message: result.message}; 
    }
    result = genValidator.validatePositiveNumber('Total',orderObj.total);
    if (result)
    {
         throw { status: result.status, field: 'total', message: result.message};  
    }

    for (const productEntry of orderObj.products) 
    {
        
        result = genValidator.validateMongoId('ProductId',productEntry.id);
        if (result)
        {
                throw { status: result.status, field: 'productId', message: result.message}; 
        }
        result = genValidator.validatePositiveNumber('Price',productEntry.price);
        if (result)
        {
            throw { status: result.status, field: 'price', message: result.message};  
        }
        result = genValidator.validatePositiveNumber('Quantity',productEntry.quantity);
        if (result)
        {
            throw { status: result.status, field: 'quantity', message: result.message};  
        }
    }

}


module.exports = {
  validateOrderPayload
}
