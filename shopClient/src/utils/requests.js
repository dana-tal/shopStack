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
              console.log(response.data);
      }
      catch(err)
      {
           console.error(err);
      }
}


export {
    sendRegistrationData
}