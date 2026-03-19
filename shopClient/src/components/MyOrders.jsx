import { useSelector } from "react-redux";
import { requestUserOrders } from "../utils/orderRequests"; 
import { useEffect ,useState } from "react";
import { Box } from "@mui/material";
import StyledTable from "./StyledTable";
import { formatDate } from "../utils/generalFuncs";
import { useIsMobile } from "../custom_hooks/useIsMobile";
import RowField from "./RowField";

function MyOrders() {

     const { isMobileDevice } = useIsMobile();
   const info = useSelector((state) => state.auth);
   const userId = info.userData.id;
   const [userOrders, setUserOrders] = useState([]);
   const paginationModel = { page: 0, pageSize: 10 };


    
  const mobileColumns = [
  {
    field: 'mobileView',
    headerName: '',
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
     
      const row = params.row;
      return (
         <Box sx={{ width: '100%' }}>
          <RowField label="Product:" value={row.productName } />
          <RowField label="Quantity: " value={formatDate(row.quantity)} />
          <RowField label="Total:" value={row.total} />
          <RowField label="Order Date:" value={formatDate(row.orderDate)} />
        </Box>
      );
    }
  }
];

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
   
   
  useEffect( ()=>{
   const fetchOrders = async ()=>{

         const orders = await requestUserOrders(userId);
        // console.log("my orders:")
        // console.log(orders.data.orderData);
         setUserOrders(orders.data.orderData);
    }
    fetchOrders();

  }, [userId]);


  

  return (
     <Box
              width={{ xs: "90%", sm: "70%", md: "70%", lg: "70%" }}
              mx="auto"
              mt={5}
              p={0}
              boxShadow={0}
              borderRadius={2}
          >
     
     
     { userOrders.length >0 &&  <StyledTable rows={userOrders} columns={isMobileDevice ?mobileColumns:columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Orders" zebraRows={true} />   }
     { userOrders.length ===0 && <p>No orders yet</p>}      
    </Box>
  )
}

export default MyOrders