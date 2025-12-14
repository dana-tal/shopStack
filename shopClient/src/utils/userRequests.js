import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";



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


export
{
    requestAllUsers,
}

