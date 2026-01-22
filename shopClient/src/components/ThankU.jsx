import {Box,Typography,Button,Paper,useMediaQuery} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function ThankU() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const location = useLocation();
  const navigate = useNavigate();

  const { orderId } = location.state || {};

  console.log("orderId is:");
  console.log(orderId);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        backgroundColor: "#f7f7f7",
        padding: isMobile ? 2 : 4
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : isTablet ? 520 : 600,
          padding: isMobile ? 3 : 4,
          mt: isMobile ? 4 : 0,
          textAlign: "center",
          borderRadius: 3
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: isMobile ? 48 : 64,
            color: "success.main",
            mb: 2
          }}
        />

        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          gutterBottom
        >
          Thank you for your order!
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 2 }}
        >
          Your order has been placed successfully.
        </Typography>

        {orderId && (
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Order ID: {orderId}
          </Typography>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            size={isMobile ? "medium" : "large"}
            onClick={() => navigate("/store/products")}
          >
            Continue Shopping
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size={isMobile ? "medium" : "large"}
            onClick={() => navigate("/store/my-orders")}
          >
            View My Orders
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ThankU;
