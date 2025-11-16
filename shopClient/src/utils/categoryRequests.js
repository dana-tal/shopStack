import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";


const requestCategoryAdd = async ( cat_obj) =>{
    try
    {
            const response = await axios.post( DOMAIN+'/category/add', { 
                categoryName: cat_obj.categoryName                                
             },  { withCredentials: true } ) // withCredentials - telling the browser : include cookies with this request and also accept and store any new cookies that come back from the server
             return {
                        ok: true,
                        data: response.data,        // the category object
                        message: "Category added successfully",
                  };                       
    }
    catch(err)
    {     
      return analize_error(err);
    }
}

const requestCategoryUpdate = async (catId, catName) =>{
    try
    {
        const response = await axios.put(DOMAIN+`category/update/${catId}`,{id:catId, categoryName:catName},  { withCredentials: true });
         return {
                        ok: true,
                        data: response.data,        // the category object
                        message: "Category updated successfully",
                  };    

    }
    catch(err)
    {     
      return analize_error(err);
    }
}

const requestAllCategories = async ()=>{
    const response = await axios.get(DOMAIN+'/category/all',  { withCredentials: true });
         return {
                        ok: true,
                        data: response.data,        // the category object
                        message: "All categories returned successfully",
                  };
   
}

export
{
    requestCategoryAdd,
    requestCategoryUpdate,
    requestAllCategories
}
