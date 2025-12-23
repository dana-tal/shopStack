import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";

const sendRegistrationData = async ( data_obj)=>{

      try
      {
            const response = await axios.post( DOMAIN+'/auth/register', { 
                firstName: data_obj.firstName, 
                lastName: data_obj.lastName, 
                userName: data_obj.userName, 
                password: data_obj.password,
                permitOrdersExposure: data_obj.permitOrdersExposure
             } ,  { withCredentials: true }) // withCredentials - telling the browser : include cookies with this request and also accept and store any new cookies that come back from the server
             return response.data;                      
      }
      catch(err)
      {
         console.error("Server error:", err.response?.data || err.message);

           // Return the server's response body if available
            if (err.response && err.response.data) 
            {
                  return err.response.data;
            } 

            // fallback for network errors etc.
            return ( { ok: false, message: "Network or unknown error" });
           
      }
      
}


const sendLoginData = async ( data_obj) =>{
    try
    {
             const response = await axios.post( DOMAIN+'/auth/login', { 
                userName: data_obj.userName, 
                password: data_obj.password                
             },  { withCredentials: true } ) // withCredentials - telling the browser : include cookies with this request and also accept and store any new cookies that come back from the server
             return {
                        ok: true,
                        data: response.data,        // the user object
                        message: "Login successful",
                  };                       
    }
    catch(err)
    {     
      return analize_error(err);
    }
}

const requestLogout = async () =>{
   
  try
  {
    const response = await axios.post( DOMAIN+'/auth/logout',{}, {withCredentials:true});
    return response.data;
  }
  catch(err)
  {     
    return analize_error(err);
  }
    
}


 const checkAuth = async ()=> {
  try {
    const res = await axios.get(`${DOMAIN}/auth/me`, {
      withCredentials: true, // withCredentials: ensures the HTTP-only cookie is sent.
    });

    return { ok: true, data: res.data };
  } 
  catch (err) 
  {
    console.error("checkAuth error", err);
    return { ok: false };
  }
}

export {
    sendRegistrationData,
    sendLoginData,
    requestLogout,
    checkAuth
}