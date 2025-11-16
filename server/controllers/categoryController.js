const categoryService = require('../services/categoryServices');


const addCategory = async (req,res) =>
{
    try
    {
        const { categoryName } = req.body;
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

        const updatedCategory = categoryService.updateCategory(id,catObj);
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