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
import { useState ,useEffect} from "react";
import { requestUserById } from "../utils/userRequests";


function CustomerForm({userId, onUpdateUser}) {

  
    const customerForm =   useForm({
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
    }  = customerForm;

    
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const onSubmit = async (data) => 
    {
        let ok;

        if (userId)
        {
            ok = await onUpdateUser(data, setError);
            if (ok)
            {
                reset();
            }
        }
     
    };


   useEffect( ()=>{
      const fetchUser = async (id)=>{
            const response = await requestUserById(id);
         
            if (response.ok)
            {
                 const user = response.data.userData;
                 reset({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            userName: user.userName,
                            password :user.password ,
                            permitOrdersExposure: user.permitOrdersExposure,                            
                    });
            }
      } 
    fetchUser(userId);
     
   },[userId]);


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
          User Update Form
      </Typography>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {isSubmitSuccessful && <Alert severity="success">User update successful!</Alert>}

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
                              validate: (v) => {
                                if (!v) return true; // password is optional

                                if (v.length < 6) return "Password must be at least 6 characters long";
                                if (v.length > 128) return "Password must be at most 128 characters long";
                                if (/\s/.test(v)) return "Password cannot contain spaces";
                                if (!/[A-Z]/.test(v)) return "Must contain at least one uppercase letter";
                                if (!/[a-z]/.test(v)) return "Must contain at least one lowercase letter";
                                if (!/\d/.test(v)) return "Must contain at least one number";
                                if (!/[!@#$%^&*(),.?":{}|<>]/.test(v))
                                  return "Must contain at least one special character";

                                return true;
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

                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <Controller
                                        name="id"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <input type="hidden" {...field} />
                                        )}
                                        />
                </Stack>
        
               <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, alignSelf: "flex-start" }}
                    >
                    Update User
                </Button>
                 
        </Stack>       
      </form>
    </Box>
  )
}

export default CustomerForm