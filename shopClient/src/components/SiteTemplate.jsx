import { Outlet } from "react-router-dom";
import "./SiteTemplate.css";
import NavBar from "./NavBar";
import { useMatch, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { requestLogout } from "../utils/authRequests";

function SiteTemplate() {

  const match_auth = useMatch("/auth/*");
  const match_admin = useMatch("/admin/*");
  const match_store = useMatch("/store/*");

  const navigate = useNavigate();

    const info = useSelector((state) => state.auth);
   // console.log("info",info);

  let links;

  if (match_admin)
  {
      links = [
                {link:'categories',name:'Categories'},
                {link:'admin-products',name:'Products'},
                {link:'customers',name:'Customers'},
                {link:'statistics',name:'Statistics'},
                { name:'Logout', callback: ()=>
                    { 
                        console.log('logging out');
                        requestLogout();
                        navigate("/auth/login", { replace: true });
                    }
                }
              ];
  }
  else if (match_store)
  {
      links = [
                {link:'products',name:'Products'},
                {link:'my-orders',name:'My Orders'},
                {link:'my-account',name:'My Account'},
                { name:'Logout', callback: ()=>{ 
                        console.log('logging out');
                        requestLogout();
                        navigate("/auth/login", { replace: true });
                }}
      ];
  }
          
  return (  
    <div className={ match_auth ? "site-container site-container2":"site-container"} >  
       { !match_auth && <span> <h3 style={{ marginLeft:"30px" ,color:"#654321"}}>Hello, {info.userData.userName}</h3> <NavBar links={links} /></span> }  
       <div className={ match_auth ? "outlet-style2":"outlet-style"} >
       
          <Outlet />      
        </div>
    </div>
  )
}

export default SiteTemplate