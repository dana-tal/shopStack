const usersService = require('../services/usersService');

const validatePersonName = (name,fieldName)=>{

     let result = null; // if all is well, null will be returned 

  
     if (!name|| typeof name !== 'string' )
     {
            result = { status: 400, message: `${fieldName} is missing or has invalid type`};
     }
     else if ( name.trim().length ===0 || name.match(/^[\-\s]+$/) )
     {
          result = { status: 400, message: `${fieldName} must contain at least one letter`}; 
     }
     else if ( ! name.match(/^[a-zA-Z\s\-]+$/) )
     {
          result = { status:400, message: `${fieldName} is invalid. Only letters, spaces, and hyphens are allowed.`};
     }
     return result;
}

const validateCategoryName = (catName)=>{

   const startRegex = /^[A-Za-z\u0590-\u05FF0-9]/; // must start with a letter (English or Hebrew or digit )
   const allowedRegex = /^[A-Za-z\u0590-\u05FF0-9\s\-\()']+$/;
  
   let result = null;
  
  if (!catName || typeof catName !== "string")
  {
     return  { status: 400, message: "Category name is missing or has invalid type" };  // 1. Missing or invalid type
  }

  const trimmed = catName.trim();

  
  if (trimmed.length === 0) 
  {
     result = { status: 400, message: "Category name cannot be empty or only spaces" }; // 2. Disallow name that is only spaces
  }
  else if (!startRegex.test(trimmed))
  {
    result =  { status: 400, message: "Category name must start with a letter or digit" }; // 3. Must start with a letter (English/Hebrew) or a digit
  }
  else if (!allowedRegex.test(trimmed)) //  allowed characters:  letters (English + Hebrew), digits, spaces, hyphens, apostrophes, parentheses
   {
     result = { status: 400, message: "Category name contains invalid characters" };
   }

  
   return result;

}

const validateUserPassword = (password, username) =>{

    let result = null;
    const lowercaseRegex = /(?=.*[a-z])/;
    const uppercaseRegex = /(?=.*[A-Z])/;
    const specialCharRegex = /(?=.*[!@#$%^&*])/;
    const spacesRegex = /\s/;
    const digitsRegex = /(?=.*\d)/;

     if (!password || password.length < 6)
     {
        return result = { status:400, message:"Password must be at least 6 characters"};
     }
     else if ( password.length > 128 )
     {
        return result = { status:400, message:"Password cannot exceed 128 characters"};
     }
     else if (!lowercaseRegex.test(password))
     {
        return result = { status:400, message:"Password must include a lowercase letter"};
     }
     else if (!uppercaseRegex.test(password))
     {
        return result = { status:400, message:"Password must include an uppercase letter"};
     }
     else if ( !digitsRegex.test(password)) 
     {
         return result = { status:400, message:"Password must include a number"};
     }
     else if (!specialCharRegex.test(password))
     {
        return result = { status:400, message:"Password must include a special character"};
     }
     else if (spacesRegex.test(password))
     {
        return result = { status:400, message:"Password cannot contain spaces"}; 
     }
     else if (password.toLowerCase().includes(username.toLowerCase()))
     {
         return result = { status:400, message:"Password cannot contain your username"}; 
     }

    return result;
  
}

const validateUsername = async (userName,includeUserExistsTest=true) =>{

    let result = null; // if all is well, null will be returned 
    const allowedCharsRegex = /^[a-zA-Z0-9._]+$/;
    const startEndRegex = /^(?![0-9._])[a-zA-Z0-9._]+(?<![_.])$/;

     if (!userName|| typeof userName !== 'string' )
     {
            result = { status: 400, message: "userName is missing or has invalid type"};
     }
     else if (userName.length < 3 )
     {
           result = { status:400 , message:"Username must be at least 3 characters"};
     }
     else if (userName.length > 20 )
     {
           result =  { status:400, message:"Username cannot exceed 20 characters"};
     }
     else if (!allowedCharsRegex.test(userName)) 
     {
        result = { status:400 , message:"Username can only contain letters, numbers, dot and underscore"};
     } 
     else if (!startEndRegex.test(userName)) 
     {
        result = { status:400, message:"Username cannot start with a digit, dot, or underscore, and cannot end with dot or underscore"}
     }

     if ( includeUserExistsTest )
     {
        const userExists = await usersService.userExists(userName); // test if this username already exists 
        if (userExists)
        {
            result = { status:400, message:"Username is already taken"}
        }
     }

     return result;
    

}

module.exports = {
    validatePersonName,
    validateUsername,
    validateUserPassword,
    validateCategoryName
}