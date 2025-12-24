import CustomerForm from "./CustomerForm"
import  { useEditableUser}  from '../custom_hooks/useEditableUser';
import { useSelector } from "react-redux";

function MyAccount() {

   const info = useSelector((state) => state.auth);
   const userId = info.userData.id;


  const { handleSimpleUserUpdate} = useEditableUser();
  return (<>         
            <CustomerForm   onUpdateUser={handleSimpleUserUpdate} userId={userId} />         
  </>)
    
}

export default MyAccount