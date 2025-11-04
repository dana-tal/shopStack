import { Outlet } from "react-router-dom";
import "./AdminTemplate.css";
import NavBar from "./NavBar";

function AdminTemplate() {
  const links = [
            {link:'categories',name:'Categories'},
            {link:'admin-products',name:'Products'},
            {link:'customers',name:'Customers'},
            {link:'statistics',name:'Statistics'}
          ];
          
  return (  
    <div className="admin-container">  
        
        <NavBar links={links} />   
       <div className="outlet-style">
          <Outlet />      
        </div>
    </div>
  )
}

export default AdminTemplate