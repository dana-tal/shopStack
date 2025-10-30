import { Outlet } from "react-router-dom";
// import NavBar from "./NavBar";
import "./ShopWelcome.css";

function ShopWelcome() {
  return (  
    <div className="library-container">  
         <span>Shop Welcome</span>
       { /* <NavBar />  */ }    
       <div className="outlet-style">
          <Outlet />      
        </div>
    </div>
  )
}

export default ShopWelcome