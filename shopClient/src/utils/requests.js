import axios from "axios";

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;


const sendRegistrationData = async ( data_obj)=>{

      try
      {
            const response = await axios.post( DOMAIN+'/auth/register', { 
                firstName: data_obj.firstName, 
                lastName: data_obj.lastName, 
                userName: data_obj.userName, 
                password: data_obj.password,
                permitOrdersExposure: data_obj.permitOrdersExposure
             } )
             return {
                        ok: true,
                        data: response.data,        // the user object
                        message: "Registration successful",
                  };
            
      }
      catch(err)
      {
           //console.error(err);
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
             } )
            return (response.data);
    }
    catch(err)
    {
          console.error(err);
    }
}


export {
    sendRegistrationData,
    sendLoginData
}