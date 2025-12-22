const categoryService = require('../services/categoryServices');
const catValidator = require('../utils/validateCategory');


const addCategory = async (req,res) =>
{
    try
    {
        const { categoryName } = req.body;
        const result = catValidator.validateCategoryName(categoryName);
        if (result)
        {
            return res.status(result.status).json({ok:false, errorField:'categoryName',message:result.message});
        }
        const newCategory = await categoryService.addCategory(categoryName);
        return res.status(201).json({ ok:true, categoryData: newCategory, message: "Category added successfully" });
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });    
    }
}

const updateCategory = async (req,res) =>
{
    try
    {
        const id = req.params.id;
        const catObj = req.body;
        const result = catValidator.validateCategoryName(catObj.categoryName);
        if (result)
        {
            return res.status(result.status).json({ok:false, errorField:'categoryName',message:result.message});
        }
        const updatedCategory = await categoryService.updateCategory(id,catObj.categoryName);
        return res.status(200).json({ ok:true, categoryData:updatedCategory,message:"Category updated successfully"});
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });    
    }
}

const removeCategory = async(req,res) =>
{
    try
    {
        const id = req.params.id;
        const removedCategory = await categoryService.removeCategory(id);
         return res.status(200).json({ ok:true, categoryData:removedCategory,message:"Category removed successfully"});
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });    
    }
}

const getAllCategories = async (req,res) =>
{
    try
    {    
        const allCategories = await categoryService.getAllCategories();
        return res.status(200).json({ ok:true, categoryData:allCategories,message:"All categories returned successfully"});
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
    addCategory,
    updateCategory,
    removeCategory,
    getAllCategories
}