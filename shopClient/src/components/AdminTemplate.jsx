import { Outlet } from "react-router-dom";
import "./AdminTemplate.css";
import AdminNavBar from "./AdminNavBar";

function AdminTemplate() {
  return (  
    <div className="admin-container">  
        
        <AdminNavBar />   
       <div className="outlet-style">
          <Outlet />      
        </div>
    </div>
  )
}

export default AdminTemplate