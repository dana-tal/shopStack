import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";


const requestUserUpdate = async (user_obj)=>
{ 
     try
    {
        const response = await axios.put( DOMAIN+'/user/update/'+user_obj.id, 
            user_obj,  { withCredentials: true } );

        return {
                   ok:true,
                   data: response.data,
                   message:'User Updated successfully'
        };
    }
    catch(err)
    {
        console.log("requestProductUpdate catch")
        return analize_error(err);
    }
}


const requestAllUsers = async ()=>{
    try
    {
        const response = await axios.get(DOMAIN+'/user/all',  { withCredentials: true });
            return {
                            ok: true,
                            data: response.data,        // the category object
                            message: "All users read successfully",
                    };
    }
    catch(err)
    {     
      return analize_error(err);
    }
}


const requestRemoveUsers = async (ids) =>{
    try
    {
        const response = await axios.delete( DOMAIN+'/user/remove-many', {data: {ids: ids} });
        return {
                 ok:true,
                 data: response.data,
                 message:"Selected users deleted successfully"
        };
    }
    catch(err)
    {
        return analize_error(err); 
    }
}


const requestUserById = async (userId) =>
{
    try
    {
        const response =await axios.get(DOMAIN+'/user/'+userId,{ withCredentials: true });
        return {
            ok: true,
            data:  response.data,
            message: "The user details read successfully"
        }
    }
    catch(err)
    {
        return analize_error(err);
    }
}

export
{
    requestAllUsers,
    requestRemoveUsers,
    requestUserUpdate,
    requestUserById
}

