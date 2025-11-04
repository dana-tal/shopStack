import { Outlet } from "react-router-dom";
import "./SiteTemplate.css";
import NavBar from "./NavBar";
import { useMatch } from "react-router-dom";

function SiteTemplate() {

  const match_auth = useMatch("/auth/*");
  const match_admin = useMatch("/admin/*");
  const match_store = useMatch("/store/*");

  let links;

  if (match_admin)
  {
      links = [
                {link:'categories',name:'Categories'},
                {link:'admin-products',name:'Products'},
                {link:'customers',name:'Customers'},
                {link:'statistics',name:'Statistics'}
              ];
  }
  else if (match_store)
  {
      links = [
                {link:'products',name:'Products'},
                {link:'my-orders',name:'My Orders'},
                {link:'my-account',name:'My Account'},
                {link:'logout', name:'Logout'}
      ];
  }
          
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