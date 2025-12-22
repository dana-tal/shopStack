

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


module.exports = {
    validateCategoryName
}