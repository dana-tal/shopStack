import { useState } from "react";
import { requestProductAdd, requestAllProducts, requestRemoveProducts } from "../utils/productRequests";

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

      const handleRemoveProducts = async (ids) =>{

        const response = await requestRemoveProducts(ids);
        if (response.ok)
        {
            setRows( (prevRows)=> {  
                       let temp = [ ...prevRows];
                       const updatedRows  =  temp.filter( prod=> { return !ids.includes(prod.id) } )
                       return updatedRows;
             })
        }
        else
        {
            console.log(response.message);
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


      return { rows,setRows, handleProductAdd ,fetchAllProducts, handleRemoveProducts,isLightboxOpen,setIsLightBoxOpen};
};

