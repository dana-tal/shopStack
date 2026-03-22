const categoryRepo = require('../repositories/categoryRepo');



const addCategory = async (catName) =>
{
    try
    {
        const newCategory = await categoryRepo.addCategory(catName);
        return newCategory;
    }
    catch(err)
    {
        throw err;
    }

}

const updateCategory = async (catId, catName)=>
{
    try
    {
        const updatedCategory = await categoryRepo.updateCategory(catId,{categoryName:catName});
        return updatedCategory;
    }
    catch(err)
    {
        throw err;
    }
}

const getCategoryById = async (catId) =>
{
    try
    {
        const category = await categoryRepo.getCategoryById(catId);
        return category;
    }
    catch(err)
    {
        throw err;
    }
}

const getAllCategories = async ()=>
{
    try
    {
       const allCats = await categoryRepo.getAllCategories();
       return allCats;
    }
    catch(err)
    {
        throw err;
    }
}

const categoryExists = async (catId) =>
{
    try
    {
       const exists  = await categoryRepo.categoryExists(catId);
       return exists;
    }
    catch(err)
    {
        throw err;
    }
}

const removeCategory = async (catId) =>
{
     try
    {
       const removedCat  = await categoryRepo.removeCategory(catId);
       return removedCat;
    }
    catch(err)
    {
        throw err;
    }
}

module.exports =
{
    addCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    categoryExists,
    removeCategory
}