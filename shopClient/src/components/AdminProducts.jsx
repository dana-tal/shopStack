import { useEffect, useRef} from "react";
import LightBox from "./LightBox";
import ProductForm from "./ProductForm";
import StyledTable from "./StyledTable";
import {Box, Alert} from "@mui/material";
import  { useEditableProduct}  from '../custom_hooks/useEditableProduct';
import CustomButton from "./CustomButton";
import { useIsMobile } from "../custom_hooks/useIsMobile";



function AdminProducts() {

  const { rows, handleProductAdd,handleProductUpdate, fetchAllProducts, handleRemoveProducts,isLightboxOpen,
     setIsLightBoxOpen ,renderProductName,productId,setProductId, feedbackMsg} = useEditableProduct();

   const { isMobileDevice } = useIsMobile();

  const tableRef = useRef();
 // const isMobileDev = isMobile();
  
  
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
       type:'string',
        renderCell: renderProductName,
    },

  ];

  if (!isMobileDevice)
  {
     columns.push( {
       field:'categoryName',
       headerName:'Category',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.category.categoryName}`,
        align:'left',
        type:'string'
    });
    columns.push({
       field:'price',
       headerName:'Price',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.price}`,
        align:'center',
         headerAlign: 'center', 
        type:'number'
    } )
  }

   const paginationModel = { page: 0, pageSize: 10 };

   useEffect( ()=>{
        fetchAllProducts();
   },[]);
  
   
   
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
      <StyledTable rows={rows} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Products" includeCheckboxes={true} ref={tableRef} />   

      
      <CustomButton clickHandler={ () => { setIsLightBoxOpen(true);   setProductId(""); }} bgColor="#1974D2"  textColor="white" label="Add New Product"/>
   
      <CustomButton clickHandler={handleClick} bgColor="#CB6D51" textColor="white" label="Remove Products"/>

      <LightBox  key={productId || "new"}         isOpen={isLightboxOpen} onCloseCallback={() => setIsLightBoxOpen(false)} backdropColor="rgba(14, 135, 204, 0.3)">
            <ProductForm   onAddProduct={handleProductAdd} onUpdateProduct={handleProductUpdate} prodId={productId} />
        </LightBox>
    </Box>
    </>
  )
}

export default AdminProducts