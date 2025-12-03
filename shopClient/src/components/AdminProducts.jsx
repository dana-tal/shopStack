import { useEffect, useRef} from "react";
import { Button } from "@mui/material";
import LightBox from "./LightBox";
import ProductForm from "./ProductForm";
import StyledTable from "./StyledTable";
import {Box} from "@mui/material";
import  { useEditableProduct}  from '../custom_hooks/useEditableProduct';




function AdminProducts() {

  const { rows, handleProductAdd, fetchAllProducts, handleRemoveProducts,isLightboxOpen, setIsLightBoxOpen } = useEditableProduct();
  const tableRef = useRef();
  

  
  const handleClick = () => {
     if (tableRef.current) 
      {
        const selectedIDs = tableRef.current.getSelectedIds();
        handleRemoveProducts(Array.from(selectedIDs.ids));      
    }
  };


  const columns = [
    {
       field:'title',
       headerName:'Product Name',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.title}`,
       align:'left',
       type:'string'
    },
    {
       field:'categoryName',
       headerName:'Category',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.category.categoryName}`,
        align:'left',
        type:'string'
    },
    {
       field:'price',
       headerName:'Price',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.price}`,
        align:'center',
         headerAlign: 'center', 
        type:'number'
    } 
  ];

   const paginationModel = { page: 0, pageSize: 10 };

   useEffect( ()=>{
        fetchAllProducts();
   },[]);
  

   return (
    <>
     <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "40%" }}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
      <StyledTable rows={rows} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Products" includeCheckboxes={true} ref={tableRef} />   

      <Button onClick={() => setIsLightBoxOpen(true)} variant="contained">
        Add New Product 
      </Button>

       <Button onClick={handleClick}  sx={{ backgroundColor:"#CB6D51", color:"white", marginLeft:"10px" }}>Remove Selected Products</Button>

      <LightBox isOpen={isLightboxOpen} onCloseCallback={() => setIsLightBoxOpen(false)} backdropColor="rgba(14, 135, 204, 0.3)">
            <ProductForm  onAddProduct={handleProductAdd}/ >
        </LightBox>
    </Box>
    </>
  )
}

export default AdminProducts