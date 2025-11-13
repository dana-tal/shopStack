
const Category = require('../models/categoryModel');


const addCategory = (catName)=>{
       const category = new Category({categoryName:catName});
       return category.save();
}


const updateCategory = (id,categoryObj)=>
{
    return Category.findByIdAndUpdate(id,categoryObj,{new:true}); // new:true means - return the updated document. By default findByIdAndUpdate returns 
                                                                  // the document as it was before the update 
}


const getCategoryById = (id) =>
{
    return Category.findById(id).lean(); // lean makes the returned object json like and faster to retrieve and use (no mongoose overhead)
}


const getAllCategories =(filters = {})=>
{
    return Category.find(filters).lean(); // lean makes the returned object json like and faster to retrieve and use (no mongoose overhead)
}

const categoryExists = (id)=>{
    return Category.exists({ _id: id});
}

const removeCategory = (id)=>
{
    return Category.findByIdAndDelete(id);
}

module.exports = {
    addCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    categoryExists,
    removeCategory
}