import { useState } from "react";
import { requestAllUsers,requestRemoveUsers} from "../utils/userRequests";



export const useEditableUser = () => { 
     const [rows, setRows] = useState([]);
      const [feedbackMsg, setFeedbackMsg] = useState("");

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


      return { rows,setRows, fetchAllUsers,handleRemoveUsers ,feedbackMsg, setFeedbackMsg};
}