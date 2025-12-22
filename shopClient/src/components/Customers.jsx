import StyledTable from "./StyledTable";
import { useEffect} from "react";
import  { useEditableUser}  from '../custom_hooks/useEditableUser';
import {Box, Alert} from "@mui/material";
import { formatDate } from "../utils/generalFuncs";
import RowField from "./RowField";
import { useIsMobile } from "../custom_hooks/useIsMobile";
import LightBox from "./LightBox";
import CustomerForm from "./CustomerForm";


function Customers() {

  
   const { isMobileDevice } = useIsMobile();
  const { rows, fetchAllUsers,feedbackMsg, handleUserUpdate,isLightboxOpen, setIsLightBoxOpen ,renderCustomerName,userId} = useEditableUser();
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
          <RowField label="Full Name :" value={row.firstName+' '+row.lastName } />
          <RowField label="Joined At: " value={formatDate(row.createdAt)} />
          <RowField label="Orders: " value={<span style={{color:'purple'}}>Orders</span>} />
        </Box>
      );
    }
  }
];

  
  const columns = [
    {
       field:'fullName',
       headerName:'Full Name',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.firstName} ${row.lastName}`,
       align:'left',
       type:'string',
       renderCell: renderCustomerName, 
    },
    {
        field:'joinedAt',
        headerName:'Joined At',
        flex:1,
        sortable:true,
        valueGetter: (value,row)=>`${ formatDate(row.createdAt)}`,
        align:'left',
        type:'string',
    },
    {
        field:'orders',
        headerName:'Orders',
        flext:1,
        sortable:false,
        valueGetter: (value,row)=>"orders",
        align:'left',
        type:'string'
    }

  ]


  useEffect( ()=>{
    fetchAllUsers();
  }, []);

 
  return (
    <>
         <Box
              width={{ xs: "90%", sm: "70%", md: "70%", lg: "70%" }}
              mx="auto"
              mt={5}
              p={3}
              boxShadow={3}
              borderRadius={2}
          >
             {feedbackMsg && <Alert severity="success">{feedbackMsg}</Alert>}
             <StyledTable rows={rows} columns={isMobileDevice ?mobileColumns:columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Customers"  />   

            <LightBox  key={userId}         isOpen={isLightboxOpen} onCloseCallback={() => setIsLightBoxOpen(false)} backdropColor="rgba(14, 135, 204, 0.3)">
                <CustomerForm   onUpdateUser={handleUserUpdate} userId={userId} />
            </LightBox>
           
          </Box>
    </>
  )
}

export default Customers