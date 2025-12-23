import { useState } from "react";
import { requestAllUsers,requestRemoveUsers, requestUserUpdate} from "../utils/userRequests";



export const useEditableUser = () => { 
    const [rows, setRows] = useState([]);
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [isLightboxOpen, setIsLightBoxOpen] = useState(false);
    const [ userId, setUserId ] = useState(""); // the user to be editted 


    
    const handleEditUser=(uId) =>{
             setUserId(uId);
             setIsLightBoxOpen(true);
    }


    
    const renderCustomerName = (params)=>{
             return <span onClick={ ()=>{  handleEditUser( params.row.id );  }} style={{ color:"blue", textDecoration:"underline" ,cursor: "pointer"}}>
                {params.row.firstName+' '+params.row.lastName }
                </span>
    }

      const showFeedback = (msg)=>{
             setFeedbackMsg(msg);
              setTimeout(() => {
                    setFeedbackMsg("");
                    }, 4000);
     }

      const fetchAllUsers = async () =>{

           const response = await requestAllUsers();
           if (response.ok)
           {
                setRows(response.data.userData);                
           }
           else
           {
               console.log(response.message);
           }
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


      return { rows,setRows, fetchAllUsers,handleRemoveUsers ,feedbackMsg, setFeedbackMsg, handleUserUpdate,isLightboxOpen, setIsLightBoxOpen,renderCustomerName,userId,handleSimpleUserUpdate};
}