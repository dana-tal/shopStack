import { useState } from "react";
import { requestProductAdd, requestAllProducts } from "../utils/productRequests";

export const useEditableProduct = () => { 
      const [rows, setRows] = useState([]);
        const [isLightboxOpen, setIsLightBoxOpen] = useState(false);


      const handleProductAdd = async (productObj, setError)=>{
              
          const response = await requestProductAdd(productObj);
          if (response.ok)
          {
              const product = response.data.productData ;
              setRows( (prevRows)=>{  return [ product,...prevRows] } );
              setIsLightBoxOpen(false);
          }
          else
          {
              console.log(response.message);
               setError("root", { type: "server", message: response.message || "Adding failed" });
          }
         
      }

      const fetchAllProducts = async () =>{

           const response = await requestAllProducts();
           if (response.ok)
           {
                setRows(response.data.productData);
           }
           else
           {
               console.log(response.message);
           }
      }


      return { rows,setRows, handleProductAdd ,fetchAllProducts, isLightboxOpen,setIsLightBoxOpen};
};

