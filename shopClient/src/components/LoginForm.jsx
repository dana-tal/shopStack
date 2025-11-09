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
import { useState } from "react";
import { sendLoginData } from '../utils/requests';
import {Link, useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice"; 

function LoginForm() {

      const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",      
    },
  });

  const navigate = useNavigate();
    const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

   const onSubmit = async (data) => {
    const trimmedData = {
        userName: data.userName.trim(),
        password: data.password.trim()
    };
    const response = await sendLoginData(trimmedData);   
    console.log("login response:"); 
     console.log(response);
      if(response.ok)
      {  //  clear the form after successful submission
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
    else
    {
        if (response.errorField) 
        {
            setError(response.errorField, {
            type: "server",
            message: response.message,
            });
        } 
        else 
        {
          setError("root", {
          type: "server",
          message: response.message || "Login failed",
          });
        }
        return;
    }
        
  };


  return (
    <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "40%" }}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
     
       {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {isSubmitSuccessful && <Alert severity="success">Login successful!</Alert>}
    <form onSubmit={handleSubmit(onSubmit)}>
         <Stack spacing={2}>
                 <Typography variant="h5" mb={3} textAlign="center">Next Generation E-Commerce</Typography>
               
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
                    Login
                </Button>
                <Typography variant="h5" mb={3} textAlign="center">New user ? <Link to="/auth/register"> Register </Link></Typography>
         </Stack>
    </form>
    </Box>
  )
}

export default LoginForm