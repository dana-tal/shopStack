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

function App() {

  return (
    <>
        <Routes>
              <Route path="/"  element={<Navigate to="/auth/login" replace />} />
              <Route path="auth"  element={ <SiteTemplate />} >
                  <Route path="register" element={<RegisterForm/>} />
                  <Route path="login" element={<LoginForm/>} />
              </Route>
              <Route path="admin" element={<SiteTemplate/>} >
                  <Route path="categories" element={<Categories/>} />
                  <Route path="admin-products" element={<AdminProducts/>} />
                  <Route path="customers" element={<Customers/>} />
                  <Route path="statistics" element={<Statistics/>} />
              </Route>
              <Route path="store" element={<SiteTemplate/>} >
                  <Route path="products" element={<StoreProducts/>} />
                  <Route path="my-orders" element={<MyOrders/>} />
                  <Route path="my-account" element={<MyAccount/>} />                
              </Route>              
        </Routes>    
    </>
  )
}

export default App
