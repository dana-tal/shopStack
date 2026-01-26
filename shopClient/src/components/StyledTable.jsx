import { DataGrid } from '@mui/x-data-grid';
 
//import Paper from '@mui/material/Paper';
import { Paper, Typography } from '@mui/material';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { getStyledTableStyles} from "../utils/styledTableStyles";
import { useMediaQuery } from '@mui/material';


const StyledTable= forwardRef( ({rows, columns, paginationModel , pageSizes, title="",includeCheckboxes=false, zebraRows = false},ref)=>
{
   const isMobile = useMediaQuery('(max-width:600px)');
   const selectionRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getSelectedIds: () => selectionRef.current
  }));

console.log("zebraRows:",zebraRows)

  return (
      <Paper sx={{  width: '96%', marginBottom:'30px !important' , backgroundColor:"#FAF0E6" }}> 
        { title && <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', backgroundColor:'#9F8C76', margin: 0,  padding: '8px 0',color:'white', fontWeight:'bold'}}>
               {title}
        </Typography> }
      <DataGrid
           loading={rows.length === 0}
            style={{ minHeight: 400 }} 
            density="standard"
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>{
                if (zebraRows)
                {
                  return params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                }
                else
                {
                    return '';
                }
              }
        }
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions= { pageSizes}
          disableRowSelectionOnClick
          checkboxSelection={includeCheckboxes}
         onRowSelectionModelChange={(selectionModel) => {
          selectionRef.current = selectionModel; 
            
        }}
        

      sx={{
          ...getStyledTableStyles(),
          minHeight: rows.length === 0 ? 400 : 'auto', // stable height while loading
          width: '100%',

// #C9C0BB 

// Zebra stripes with higher specificity
"& .even.MuiDataGrid-row": { backgroundColor: "#f5f5f5" },
"& .odd.MuiDataGrid-row": { backgroundColor: "#C8AD7F" },


// Hover effect
"& .even.MuiDataGrid-row:hover": { backgroundColor: "#e0dcd1 !important" },
"& .odd.MuiDataGrid-row:hover": { backgroundColor: "#e0dcd1 !important" },


// Selected rows
"& .even.Mui-selected": { backgroundColor: "#c8b69c !important" },
"& .odd.Mui-selected": { backgroundColor: "#c8b69c !important" },

        }}
        getRowHeight={isMobile ? () => 'auto' : undefined} // responsive on mobile
         
      />
   
    </Paper>
  )
});

export default StyledTable