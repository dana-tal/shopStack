import StyledTable from "./StyledTable";
import { useEffect } from "react";
import  { useEditableCategory}  from '../custom_hooks/useEditableCategory';
import { requestAllCategories } from '../utils/categoryRequests';
import {Box} from "@mui/material";
import CategoryForm from './CategoryForm';

function Categories() {

  const { rows, setRows, renderCategoryName,renderEditUpdateButton,renderRemoveButton, handleAddCategory } = useEditableCategory();
  
  const columns = [
  { 
       field: 'categoryName',
       headerName: 'Category',
       flex:1 ,
      sortable:true,
      valueGetter: (value,row)=>`${row.categoryName}`,
      renderCell: renderCategoryName
  },
  { 
    field: 'edit', 
    headerName: 'Edit', 
    flex:1,
    renderCell: renderEditUpdateButton,

  },
  { 
    field: 'remove', 
    headerName: 'Remove', 
    flex:1,
    renderCell: renderRemoveButton
  },
];

 const paginationModel = { page: 0, pageSize: 10 };

 
  useEffect( ()=>
    {
      const readAllCategories = async ()=>
        {
          const all = await requestAllCategories();
          setRows(all.data.categoryData);
        }
        readAllCategories();
    }, []);

  return (
      <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "40%" }}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
      <StyledTable rows={rows} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} />   
      <CategoryForm onAddCategory={handleAddCategory} />
    </Box>
  )
}

export default Categories