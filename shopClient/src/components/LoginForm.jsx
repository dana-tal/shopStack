import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
   Stack,
   IconButton, InputAdornment 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import { useState, useEffect } from "react";
import { sendLoginData } from '../utils/authRequests';
import {Link, useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice"; 
import "./AuthForm.css";
import axios from "axios";

function LoginForm() {

  const loginForm  = useForm({
    defaultValues: {
      userName: "",
      password: "",      
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError
  } = loginForm;

 
  const navigate = useNavigate();
    const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGuestLoading , setIsGuestLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    
    const warmUpServer = () => {
      axios.get(`${import.meta.env.VITE_APP_DOMAIN}/`, {
        withCredentials: true,
      }).catch(() => {
        // ignore errors - warm-up only
      });
    };
    

   const loginHandler = async (data)=>
    {
      console.log("loginHandler");
        try
        {
            const response = await sendLoginData(data);           
            reset(); 
            dispatch(setUser(response.data.userData)); // send the user info to  the Redux store 
            if ( response.data.userData.isAdmin)
            {
                  navigate("/admin/categories", { replace: true });
            }
            else
            {
                navigate("/store/products", { replace: true });
            }          
        }
      catch (err)
      {
          const data = err.response?.data;
          if (data?.errorField) 
          {
            setError(data.errorField, {type: "server",message: data.message});
          }
          else
          {
            setError("root", {type: "server",message: data?.message || "Login failed"});
          }
      }
   } 


   
  const handleGuestLogin= async ()=>{
      console.log("guest login");
    
      const data = { userName: import.meta.env.VITE_GUEST_USERNAME , password: import.meta.env.VITE_GUEST_PASSWORD };
      setIsGuestLoading(true);
      await loginHandler(data);
      setIsGuestLoading(false);
  }


   const onSubmit = async (data) => {
    const trimmedData = {
        userName: data.userName.trim(),
        password: data.password.trim()
    };
    setIsLoginLoading(true);
    await loginHandler(trimmedData);
    setIsLoginLoading(false);    
  };

  
  useEffect(() => {
    warmUpServer();
  }, []);
  
  

  return (
    <Box
    width={{ xs: "90%", sm: "70%", md: "70%", lg: "40%" }}
      
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
      backgroundColor="#F8F6F0"
      minHeight={{xs:"400px", sm:"500px", md:"500px",lg:"500px"}}
      alignItems="center"
      display="flex"
    >
     
       {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {isSubmitSuccessful && <Alert severity="success">Login successful!</Alert>}
    <form onSubmit={handleSubmit(onSubmit)} style={{ width:"100%"}}>
         <Stack spacing={2}>
                 <Typography variant="h5" mb={3} textAlign="center" sx={{fontSize:"20px", whiteSpace:"nowrap" }}>Next Generation E-Commerce</Typography>
               
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 }}>Username:</Typography>
                        <Controller
                        name="userName"
                        control={control}
                        rules={{ required: "Username is required",
                                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                                    pattern: { value: /^[^\s]+$/, message: "Username cannot contain spaces" }
                         }}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            size="small"
                            fullWidth
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                            />
                        )}
                        />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ width: 120 }}>Password:</Typography>
                    <Controller
                    name="password"
                    control={control}                    
                    rules={{
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                    }}
                    render={({ field }) => (
                       <TextField
                        {...field}
                        type={showPassword ? "text" : "password"} // toggle visibility
                        size="small"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                        />
                    )}
                    />
                </Stack>

                <Button fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, alignSelf: "flex-start" }}
                    >
                    {isLoginLoading ?"Please wait, waking up the server...":"Login"}
                </Button>
                <Typography variant="h5" mb={3} textAlign="center">New user ? <Link to="/auth/register"> Register </Link></Typography>

              <Divider sx={{ my: 2, fontFamily:"Arial",fontSize: "20px",   '&::before, &::after': {borderColor: 'black',}, }} > Or </Divider>
            

              <Button
              fullWidth
              type="button"
              variant="contained"
              color="info"
               sx={{
                mt: 2,
                alignSelf: "flex-start",
              }}
              onClick={handleGuestLogin}
            >
             { isGuestLoading ? "Please wait, waking up the server...":"Continue As Guest"}
            </Button>
         </Stack>
    </form>
    </Box>
  )
}

export default LoginForm