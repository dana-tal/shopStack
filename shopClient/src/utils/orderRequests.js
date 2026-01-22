import axios from "axios";
import { analize_error,DOMAIN  } from "./generalFuncs";


const requestOrderPlace = async (userId,order_obj)=>{
    try
    {
       
       const response = await axios.post(DOMAIN+'/order/placeOrder',
            {
                userId: userId,
                total: order_obj.total,
                products: order_obj.products
            },{withCredentials:true}
        );
        return {
                   ok:true,
                   data: response.data,
                   message:'Order Placed successfully'
        }; 
    }
    catch(err)
    {
        console.log("requestOrderPlace catch")
        return analize_error(err);
    }
}


export {
    requestOrderPlace
}