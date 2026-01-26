import { useSelector } from "react-redux";
import { requestUserOrders } from "../utils/orderRequests"; 
import { useEffect ,useState } from "react";
import { Box } from "@mui/material";
import StyledTable from "./StyledTable";
import { formatDate } from "../utils/generalFuncs";

function MyOrders() {

  
   const info = useSelector((state) => state.auth);
   const userId = info.userData.id;
   const [userOrders, setUserOrders] = useState([]);
   const paginationModel = { page: 0, pageSize: 10 };

    const columns = [
      {
        field: 'productName',
        headerName: 'Product',
        flex:1 ,
        sortable:true,
        valueGetter: (value,row)=>`${row.productName}`,
        align:'left',
        headerAlign: 'left', 
      },
      {
         field:'quantity',
          headerName: 'Quantity',
          flex:1 ,
          sortable:true,
          valueGetter: (value,row)=>`${row.quantity}`,
          align:'left',
          headerAlign: 'left',  
      },
      {
         field:'total',
          headerName: 'Total',
          flex:1 ,
          sortable:true,
          valueGetter: (value,row)=>`${row.total}`,
          align:'left',
          headerAlign: 'left',  
      },
      {
         field:'orderDate',
          headerName: 'Date',
          flex:1 ,
          sortable:true,
          valueGetter: (value,row)=>`${formatDate(row.orderDate)}`,
          align:'left',
          headerAlign: 'left',  
      },
    ];
   
   console.log("userId:",userId);
  useEffect( ()=>{
   const fetchOrders = async ()=>{

         const orders = await requestUserOrders(userId);
        // console.log("my orders:")
        // console.log(orders.data.orderData);
         setUserOrders(orders.data.orderData);
    }
    fetchOrders();

  }, [userId]);


  console.log("user Orders:");
  console.log(userOrders);

  return (
     <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "100%" }}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={0}
      borderRadius={2}
    >
      <StyledTable rows={userOrders} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Orders" zebraRows={true} />         
    </Box>
  )
}

export default MyOrders