import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./store/authSlice";
import { checkAuth } from "./utils/requests";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { Routes, Route, Navigate} from 'react-router-dom';
import SiteTemplate from "./components/SiteTemplate";
import Categories from './components/Categories';
import AdminProducts from "./components/AdminProducts";
import Customers from "./components/Customers";
import Statistics from "./components/Statistics";

import StoreProducts from "./components/StoreProducts";
import MyOrders from "./components/MyOrders";
import MyAccount from "./components/MyAccount";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
   const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

   // Check if user is already logged in (based on cookie)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await checkAuth();

        if (response.ok && response.data?.userData) {
          // Server responded with valid user data
          dispatch(setUser(response.data.userData));  // initialize the redux store with the user details 
        } 
        else 
          {
          // Token invalid / missing / expired
          dispatch(clearUser()); 
        }
      } 
      catch (err) 
      {
        console.error("checkAuth failed:", err);
        dispatch(clearUser());
      }
      finally
       {
          setLoading(false);
      }
    };

     verifyUser();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
        <Routes>
              <Route path="/"  element={<Navigate to="/auth/login" replace />} />
              <Route path="auth"  element={ <SiteTemplate />} >
                  <Route path="register" element={<RegisterForm/>} />
                  <Route path="login" element={<LoginForm/>} />
              </Route>
              <Route path="admin" element={<ProtectedRoute adminOnly={true}><SiteTemplate/></ProtectedRoute>} >
                  <Route path="categories" element={<Categories/>} />
                  <Route path="admin-products" element={<AdminProducts/>} />
                  <Route path="customers" element={<Customers/>} />
                  <Route path="statistics" element={<Statistics/>} />
              </Route>
              <Route path="store" element={<ProtectedRoute><SiteTemplate/></ProtectedRoute>} >
                  <Route path="products" element={<StoreProducts/>} />
                  <Route path="my-orders" element={<MyOrders/>} />
                  <Route path="my-account" element={<MyAccount/>} />                
              </Route>              
        </Routes>    
    </>
  )
}

export default App
