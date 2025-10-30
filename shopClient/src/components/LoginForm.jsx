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
import {Link} from 'react-router-dom';

function LoginForm() {

      const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",      
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

   const onSubmit = async (data) => {
    console.log("Form submitted:", data);
        reset(); // clear the form after successful submission
    const result = await sendLoginData(data);    
     console.log(result);
        
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
     
      {isSubmitSuccessful && <Alert severity="success">Login successful!</Alert>}
    <form onSubmit={handleSubmit(onSubmit)}>
         <Stack spacing={2}>
                 <Typography variant="h5" mb={3} textAlign="center">Next Generation E-Commerce</Typography>
               
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 }}>Username:</Typography>
                        <Controller
                        name="userName"
                        control={control}
                        rules={{ required: "Username is required" }}
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