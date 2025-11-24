 const validateCategoryName = (value) => 
{
  if (typeof value !== "string") return "Category name is missing or has invalid type";

  const trimmed = value.trim();
  if (trimmed.length === 0) return "Category name cannot be empty or only spaces";

  const startRegex = /^[A-Za-z\u0590-\u05FF0-9]/;
  const allowedRegex = /^[A-Za-z\u0590-\u05FF0-9\s\-\()']+$/;

  if (!startRegex.test(trimmed)) {
    return "Category name must start with a letter or digit";
  }

  if (!allowedRegex.test(trimmed)) {
    return "Category name contains invalid characters";
  }

  return ""; // no error
}


export
{
    validateCategoryName
}