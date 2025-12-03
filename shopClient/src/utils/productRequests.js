import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";


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

        console.log("requestProductAdd try");
        console.log(response);
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
     requestAllProducts,
     requestRemoveProducts
}