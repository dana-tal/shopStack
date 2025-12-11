import { DataGrid } from '@mui/x-data-grid';
 
//import Paper from '@mui/material/Paper';
import { Paper, Typography } from '@mui/material';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { getStyledTableStyles} from "../utils/styledTableStyles";


const StyledTable= forwardRef( ({rows, columns, paginationModel , pageSizes, title="",includeCheckboxes=false},ref)=>
{
   const selectionRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getSelectedIds: () => selectionRef.current
  }));

  return (
      <Paper sx={{  width: '96%', marginBottom:'30px !important' , backgroundColor:"#FAF0E6" }}> 
        { title && <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', backgroundColor:'#9F8C76', margin: 0,  padding: '8px 0',color:'white', fontWeight:'bold'}}>
               {title}
        </Typography> }
      <DataGrid
         
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions= { pageSizes}
          disableRowSelectionOnClick
          checkboxSelection={includeCheckboxes}
         onRowSelectionModelChange={(selectionModel) => {
          selectionRef.current = selectionModel; 
        }}
        

        sx={ getStyledTableStyles() }
      />
    </Paper>
  )
});

export default StyledTable