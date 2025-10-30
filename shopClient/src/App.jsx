import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { Routes, Route, Navigate} from 'react-router-dom';
import ShopWelcome from "./components/ShopWelcome";


function App() {

  return (
    <>
        <Routes>
              <Route path="/"  element={<Navigate to="/auth/login" replace />} />
              <Route path="auth"  element={ <ShopWelcome />} >
                  <Route path="register" element={<RegisterForm/>} />
                  <Route path="login" element={<LoginForm/>} />
              </Route>
              
        </Routes>

      {  /* <RegisterForm /> */}
       { /*<LoginForm />*/  }    
    </>
  )
}

export default App
