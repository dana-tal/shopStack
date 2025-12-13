import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  Typography,
  Alert,
   Stack,
   IconButton, InputAdornment 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { sendRegistrationData} from '../utils/authRequests';
import { Link, useNavigate} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice"; 
import "./RegisterForm.css";

function RegisterForm() {

    const registerForm =   useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      permitOrdersExposure: false
    },
  });

      const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError
  }  = registerForm;



  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

 const onSubmit = async (data) => {
   // console.log("Form submitted:", data);
       
        try
        {
            const response = await sendRegistrationData(data);
          //  console.log("Server response:", response);
            if (!response.ok) 
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
                    message: response.message || "Registration failed",
                    });
                }
                return;
            } // end of if !response.ok
            reset(); // clear the form after successful submission            
            dispatch(setUser(response.userData));            
             navigate("/store/products", { replace: true });
        }
        catch(err)
        {
          setError("root", {
                type: "server",
                message: "Network error. Please try again later.",
              });
        }

  };



  return (
    <Box
      width="80%"
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
      <Typography variant="h5" mb={3} textAlign="center" >
        Registration Form
      </Typography>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {isSubmitSuccessful && <Alert severity="success">Registration successful!</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width:"100%"}}>
        <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120, whiteSpace:"nowrap" }} className="reg-label-font">First Name:</Typography>
                        <Controller
                        name="firstName"
                        control={control}                        
                         rules={{
                                  required: "First name is required",
                                  minLength: {
                                    value: 2,
                                    message: "First name must be at least 2 characters long",
                                  },
                                  pattern: {
                                    value: /^[A-Za-zÀ-ž\s'-]+$/,
                                    message: "Only letters ans spaces are allowed",
                                  },
                                }}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            size="small"
                            fullWidth
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            />
                        )}
                        />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 ,whiteSpace:"nowrap" }} className="reg-label-font"> Last Name:</Typography>
                        <Controller
                        name="lastName"
                        control={control}
                        rules={{
                                  required: "Last name is required",
                                  minLength: {
                                    value: 2,
                                    message: "Last name must be at least 2 characters long",
                                  },
                                  pattern: {
                                    value: /^[A-Za-zÀ-ž\s'-]+$/,
                                    message: "Only letters ans spaces are allowed",
                                  },
                                }}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            size="small"
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            />
                        )}
                        />
                </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 ,whiteSpace:"nowrap" }} className="reg-label-font">Username:</Typography>
                        <Controller
                        name="userName"
                        control={control}
                        rules={{
                                  required: "Username is required",
                                  minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters long",
                                  },
                                  maxLength: {
                                    value: 20,
                                    message: "Username must be less than 20 characters",
                                  },
                                  pattern: {
                                    // Username rules:
                                    //  - allowed: letters, digits, dot, underscore
                                    //  - cannot start with digit, dot, or underscore
                                    //  - cannot end with dot or underscore
                                    value: /^(?![._\d])[A-Za-z0-9._]{1,18}(?<![._])$/,
                                    message:
                                      "Username can contain letters, numbers, dot and underscore only, cannot start with digit/dot/underscore or end with dot/underscore",
                                  },
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
                    <Typography sx={{ width: 120,whiteSpace:"nowrap"  }} className="reg-label-font">Password:</Typography>
                    <Controller
                    name="password"
                    control={control}                    
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                      maxLength: {
                        value: 128,
                        message: "Password must be at most 128 characters long",
                      },
                      validate: {
                        noSpaces: (v) => !/\s/.test(v) || "Password cannot contain spaces",
                        hasUpper: (v) =>
                          /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                        hasLower: (v) =>
                          /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                        hasDigit: (v) =>
                          /\d/.test(v) || "Must contain at least one number",
                        hasSymbol: (v) =>
                          /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                          "Must contain at least one special character",
                      },
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

                <Stack direction="row" alignItems="center" spacing={1}>
                <Controller
                    name="permitOrdersExposure"
                    control={control}
                    render={({ field }) => (
                    <Checkbox
                        {...field}
                        checked={field.value}
                    />
                    )}
                />
                <Typography>Allow others to see my orders</Typography>
                </Stack>


        
               <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, alignSelf: "flex-start" }}
                    >
                    Register
                </Button>
                 <Typography variant="h5" mb={3} textAlign="center">Allready a member ? <Link to="../login"> Login </Link></Typography>
        </Stack>       
      </form>
    </Box>
  )
}

export default RegisterForm