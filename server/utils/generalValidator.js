const mongoose = require('mongoose');

const validateMongoId = ( fieldName, mongoId ) =>
{
    let result=null;

    if (!mongoId || !mongoose.Types.ObjectId.isValid(mongoId))
    {
        result = { status:400, message:` ${fieldName} must be a valid ObjectId `};
    }
    return result;
}


const validateUrl = ( fieldName, urlAddress ) =>{
   
    let result =null;
    if (!urlAddress || typeof urlAddress !== "string")
    {
        result = {status:400, message:`${fieldName} is required.`};
    }
    else
    {
        try
        {
            new URL(urlAddress);
        }
        catch 
        {
           result = { status:400, message:`${fieldName} must be a valid url`};
        }
    }
    return result;
}

const validateImageUrl = (fieldName, urlAddress) =>{

   let result=null;

   result = validateUrl(fieldName, urlAddress);
   if (result!==null)
   {
       return result;
   }
   // Validate image extension
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  if (!allowedExtensions.test(urlAddress)) 
  {
      result = { status:400, message:"Image url must end with a valid file extension (jpg,jpeg, png, gif, webp) "};    
  }
  return result;
}


const validatePositiveNumber = ( fieldName, numValue)=>
{
    let result =null;

     if ( typeof numValue !== "number" || numValue <=0 )
     {
       result =  {status:400, message:`${fieldName} must be a positive number`}; 
     }
     return result;
}

const validateTitle = (objectName,title,minLength=2,maxLength=80) =>
{
    let result = null;

    if ( !title || typeof title !== "string" || !title.trim())
    {
        return { status: 400, message: `${objectName} title is missing or has invalid type` }; 
    }
    const titleLength = title.trim().length;

    if (titleLength < minLength || titleLength > maxLength)
    {
        result = { status:400, message:`Title length must be between ${minLength} and ${maxLength} characters`};
    }
    else 
    {
          const titleRegex = /^[\p{L}\d\s.,!?'"-]+$/u;   // allow only  letters (any language) ,digits ,spaces and puntuation marks (. , ! ? - ' ");
           if (!titleRegex.test(title))
           {
                result = { status:400, message:"Title contains invalid characters."};
           }
    }
    return result;
}

const validateDescription = (objectName,description,minLength=5,maxLength=1000) =>
{
    let result = null;
    const forbiddenChars = /[<>{}\[\]]/; // Forbidden characters: < > { } [ ]
    const scriptPattern = /(script|onerror|onload|javascript:)/i; // Script-like patterns
    
    
    if ( !description || typeof description !== 'string' || !description.trim())
    {
        return { status:400, message:`${objectName} description is required`};
    }
    const descLength = description.trim().length;
    if (descLength < minLength || descLength > maxLength )
    {
        result = { status:400, message:`Description length must be between ${minLength} and ${maxLength} characters`};
    }
    else 
    {
        if (forbiddenChars.test(description)) 
        {
           result =  { status:400 , message:"Description contains forbidden characters ( < > { } [ ] )."}        
        }
        else if (scriptPattern.test(description)) 
        {
            result = { status:400, message:"Description contains forbidden script-like content"};
        }
    }
    return result;
}




module.exports = {
    validateMongoId,
    validateUrl,
    validateImageUrl,
    validatePositiveNumber,
    validateTitle,
    validateDescription
}

