import { useState } from "react";
import { requestProductAdd,requestProductUpdate, requestAllProducts, requestRemoveProducts } from "../utils/productRequests";


export const useEditableProduct = () => { 
      const [rows, setRows] = useState([]);
      const [isLightboxOpen, setIsLightBoxOpen] = useState(false);
      const [ productId, setProductId ] = useState(""); // the product to be editted 

    const handleEditProduct=(prodId) =>{
             //console.log("productId="+productId);
             setProductId(prodId);
             setIsLightBoxOpen(true);
    }

    const renderProductName = (params)=>{
             return <span onClick={ ()=>{  handleEditProduct( params.row.id );  }} style={{ color:"blue", textDecoration:"underline" ,cursor: "pointer"}}>{params.row.title}</span>
    }

    
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

    const handleProductUpdate = async (productObj, setError)=>
      {

        const response = await requestProductUpdate(productObj);
        if (response.ok)
        {
            const updatedProduct = response.data.productData ;
            setRows( (prevRows)=>{  
                let temp = [...prevRows]; 
                let updated = temp.map( (product)=>{ if (product.id=== updatedProduct.id){ return updatedProduct } else { return product }  } );
                return updated;
            });
            setIsLightBoxOpen(false);              
        }
        else
        {
            console.log(response.message);
            setError("root", { type: "server", message: response.message || "Update failed" }); 
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


      return { rows,setRows, handleProductAdd ,handleProductUpdate,fetchAllProducts, handleRemoveProducts,isLightboxOpen,setIsLightBoxOpen,renderProductName, productId, setProductId};
};

