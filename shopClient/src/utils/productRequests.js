import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";


const requestProductUpdate = async (product_obj)=>
{ 
     try
    {
        const response = await axios.put( DOMAIN+'/product/update/'+product_obj.id, 
            {
                title: product_obj.title,
                price: +product_obj.price,
                catId: product_obj.catId,
                imageUrl: product_obj.imageUrl,
                description: product_obj.description
        },  { withCredentials: true } );

        return {
                   ok:true,
                   data: response.data,
                   message:'Product Updated successfully'
        };
    }
    catch(err)
    {
        console.log("requestProductUpdate catch")
        return analize_error(err);
    }
}

const requestProductAdd = async (product_obj) =>{
    try
    {
        const response = await axios.post( DOMAIN+'/product/add', 
            {
                title: product_obj.title,
                price: +product_obj.price,
                catId: product_obj.catId,
                imageUrl: product_obj.imageUrl,
                description: product_obj.description
        },  { withCredentials: true } );

        return {
                   ok:true,
                   data: response.data,
                   message:'Product Added successfully'
        };
    }
    catch(err)
    {
        console.log("requestProductAdd catch")
        return analize_error(err);
    }
}


const requestProductById = async (prodId) =>
{
    try
    {
        const response =await axios.get(DOMAIN+'/product/'+prodId,{ withCredentials: true });
        return {
            ok: true,
            data:  response.data,
            message: "The product details read successfully"
        }
    }
    catch(err)
    {
        return analize_error(err);
    }
}

const requestAllProducts = async ()=> {

    try
    {
        const response = await axios.get (DOMAIN +'/product/all',{ withCredentials: true })
        return {
                    ok:true,
                    data: response.data,
                    message:"All products returned successfully"
                };
    }
    catch(err)
    {
        return analize_error(err);
    }
}

const requestRemoveProducts = async (ids) =>{
    try
    {
        const response = await axios.delete( DOMAIN+'/product/remove-many', {data: {ids: ids} });
        return {
                 ok:true,
                 data: response.data,
                 message:"Selected products deleted successfully"
        };
    }
    catch(err)
    {
        return analize_error(err); 
    }
}

export {
     requestProductAdd,
     requestProductUpdate,
     requestAllProducts,
     requestRemoveProducts,
     requestProductById
}