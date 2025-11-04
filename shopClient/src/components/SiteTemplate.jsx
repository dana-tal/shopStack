import { Outlet } from "react-router-dom";
import "./SiteTemplate.css";
import NavBar from "./NavBar";
import { useMatch } from "react-router-dom";

function SiteTemplate() {

  const match_auth = useMatch("/auth/*");

  const links = [
            {link:'categories',name:'Categories'},
            {link:'admin-products',name:'Products'},
            {link:'customers',name:'Customers'},
            {link:'statistics',name:'Statistics'}
          ];
          
  return (  
    <div className="site-container">  
       { !match_auth && <NavBar links={links} /> }  
       <div className="outlet-style">
          <Outlet />      
        </div>
    </div>
  )
}

export default SiteTemplate