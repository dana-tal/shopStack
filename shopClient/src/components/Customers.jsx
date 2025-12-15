import StyledTable from "./StyledTable";
import { useEffect,useRef ,useState} from "react";
import  { useEditableUser}  from '../custom_hooks/useEditableUser';
import {Box, Alert, Typography} from "@mui/material";
import { formatDate,isMobile } from "../utils/generalFuncs";
import RowField from "./RowField";
import CustomButton from "./CustomButton";

function Customers() {

  const [isMobileDevice,setIsMobileDevice ] =useState(isMobile());
  const { rows, fetchAllUsers,handleRemoveUsers ,feedbackMsg } = useEditableUser();
  const tableRef = useRef(); // for accessing the checkboxes ...
  const paginationModel = { page: 0, pageSize: 10 };
  
  const handleClick = () => {
     if (tableRef.current) 
      {
        const selectedIDs = tableRef.current.getSelectedIds();
        handleRemoveUsers(Array.from(selectedIDs.ids));
        //handleRemoveProducts(Array.from(selectedIDs.ids));      
    }
  };

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
       /* renderCell: renderProductName, */
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

  
    useEffect(() => {
               const update = () => { setIsMobileDevice(isMobile()) };
               
               window.addEventListener("resize", update);
               return () => window.removeEventListener("resize", update);
           }, []);


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
             <StyledTable rows={rows} columns={isMobileDevice ?mobileColumns:columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Customers" includeCheckboxes={true} ref={tableRef} />   
              <CustomButton  clickHandler={handleClick} bgColor="#CB6D51" textColor="white" label="Remove Users"/>
        
          </Box>
    </>
  )
}

export default Customers