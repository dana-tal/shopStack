import { useState } from "react";
import { requestAllUsers} from "../utils/userRequests";



export const useEditableUser = () => { 
     const [rows, setRows] = useState([]);


      const fetchAllUsers = async () =>{

           const response = await requestAllUsers();
           if (response.ok)
           {
                setRows(response.data.userData);
                console.log(response.data.userData);
           }
           else
           {
               console.log(response.message);
           }
      }

      return { rows,setRows, fetchAllUsers };
}