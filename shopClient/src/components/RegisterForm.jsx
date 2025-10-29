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
import { sendRegistrationData} from '../utils/requests';

function RegisterForm() {

      const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      permitOrdersExposure: false
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

 const onSubmit = (data) => {
    console.log("Form submitted:", data);
        reset(); // clear the form after successful submission
        sendRegistrationData(data);
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
      <Typography variant="h5" mb={3} textAlign="center">
        Registration Form
      </Typography>

      {isSubmitSuccessful && <Alert severity="success">Registration successful!</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 }}>First Name:</Typography>
                        <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: "First name is required" }}
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
                        <Typography sx={{ width: 120 }}>Last Name:</Typography>
                        <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: "Last name is required" }}
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
        </Stack>       
      </form>
    </Box>
  )
}

export default RegisterForm