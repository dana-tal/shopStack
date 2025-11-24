import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
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

        <Paper sx={{ minHeight: 400, width: '100%', marginBottom:'30px' , backgroundColor:"#FAF0E6" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20, 30]}
       
        sx={{ border: 0, backgroundColor:"#F8F0E3", 

          "& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitleContainer": {
              display: "flex",
              justifyContent: "center",
              width: "100%",
            },
              
            "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#E1D9D1",
            display: "flex",
            justifyContent: "center",
          },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                 textAlign: "center",
                  width: "100%",
              },
                      
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },

                      "& .MuiDataGrid-row:hover": {
                backgroundColor: "#FAEBD7", //  "#D3E4CD
              },

               "& .MuiDataGrid-row.Mui-selected": {
                     backgroundColor:"#FFE4C4   !important",   // your selected color  #B3D9D9 "#A0D6B4 
               },
         }}
      />
    </Paper>   
    <CategoryForm onAddCategory={handleAddCategory} />
    </Box>
  )
}

export default Categories