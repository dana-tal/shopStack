import { useState } from "react";
import { requestAllUsers,requestRemoveUsers, requestUserUpdate, } from "../utils/userRequests";
import { requestUserProducts } from "../utils/orderRequests";



export const useEditableUser = () => { 
    const [rows, setRows] = useState([]);
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [isLightboxOpen, setIsLightBoxOpen] = useState(false);
    const [lightBoxContent, setLightBoxContent] = useState("");
    const [ userId, setUserId ] = useState(""); // the user to be editted 
    const [ userFullName, setUserFullName ] = useState("");
    const [userProducts, setUserProducts] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);


    
    const handleEditUser=(uId) =>{
             setUserId(uId);
             setIsLightBoxOpen(true);
             setLightBoxContent("user-form");
    }

    const handleUserOrders = async (uId, fullName)=>{
             setUserId(uId);
             setUserFullName(fullName)
             setIsLightBoxOpen(true);
             setLightBoxContent("user-orders"); 
             setLoadingProducts(true);
             const info = await requestUserProducts(uId);
             setUserProducts(info.data.orderData);
             setLoadingProducts(false);
            
    }

    
    const renderCustomerName = (params)=>{
             return <span onClick={ ()=>{  handleEditUser( params.row.id );  }} style={{ color:"blue", textDecoration:"underline" ,cursor: "pointer"}}>
                {params.row.firstName+' '+params.row.lastName }
                </span>
    }

    const renderCustomerOrders = (params)=>{
        return <span onClick={ ()=>{  handleUserOrders( params.row.id,  params.row.firstName+' '+params.row.lastName);  }} style={{ color:"blue", textDecoration:"underline" ,cursor: "pointer"}}>Orders</span>
    }

      const showFeedback = (msg)=>{
             setFeedbackMsg(msg);
              setTimeout(() => {
                    setFeedbackMsg("");
                    }, 4000);
     }

      const fetchAllUsers = async () =>{

           setLoadingUsers(true);
           const response = await requestAllUsers();
           if (response.ok)
           {
                setRows(response.data.userData);                
           }
           else
           {
               console.log(response.message);
           }
           setLoadingUsers(false);
      }


     const handleRemoveUsers = async (ids) =>
     {
        const response = await requestRemoveUsers(ids);
        if (response.ok)
        {
            setRows( (prevRows)=> {  
                       let temp = [ ...prevRows];
                       const updatedRows  =  temp.filter( prod=> { return !ids.includes(prod.id) } )
                       return updatedRows;
             })
            showFeedback("User(s) removed successfully");     
        }
        else
        {
            console.log(response.message);
        }
      }


      const handleSimpleUserUpdate = async (userObj,setError) =>
      {
            const response = await requestUserUpdate(userObj);
            if (response.ok)
            {
                  showFeedback("User updated successfully");         
            }
            else
            {
                console.log(response.message);
                setError("root", { type: "server", message: response.message || "Update failed" }); 
            }
      }

      const handleUserUpdate = async (userObj, setError)=>
      {
        const response = await requestUserUpdate(userObj);
        if (response.ok)
        {
            const updatedUser = response.data.userData ;
            setRows( (prevRows)=>{  
                let temp = [...prevRows]; 
                let updated = temp.map( (user)=>{ if (user.id=== updatedUser.id){ return updatedUser } else { return user }  } );
                return updated;
            });
            setIsLightBoxOpen(false);  
            showFeedback("User updated successfully");                 
        }
        else
        {
            console.log(response.message);
            setError("root", { type: "server", message: response.message || "Update failed" }); 
        }
    }


      return { rows,setRows, fetchAllUsers,handleRemoveUsers ,feedbackMsg,
                setFeedbackMsg, handleUserUpdate,isLightboxOpen, setIsLightBoxOpen,
                renderCustomerName,userId,renderCustomerOrders,lightBoxContent,userProducts,userFullName, loadingUsers,loadingProducts};
}