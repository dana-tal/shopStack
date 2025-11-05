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


const analize_error = (err) =>{
      console.log("analize error");
    if (err.response)  // Server responded with non-2xx status
      {
      console.log("Server responded with:", err.response.data);
      return {
        ok: false,
        message: err.response.data.message || "Login failed",
        data: err.response.data,
      };
    } 
    else if (err.request) // Request was sent, but no response
    {
      console.log("No response received:", err.request);
      return {
        ok: false,
        message: "No response from server",
      };
    } 
    else   // Something else went wrong
    {
      console.log("Unexpected error:", err.message);
      return {
        ok: false,
        message: "Unexpected error: " + err.message,
      };
    }
}


const sendLoginData = async ( data_obj) =>{
    try
    {
             const response = await axios.post( DOMAIN+'/auth/login', { 
                userName: data_obj.userName, 
                password: data_obj.password                
             } )
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


export {
    sendRegistrationData,
    sendLoginData
}