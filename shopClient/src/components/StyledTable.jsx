import { DataGrid } from '@mui/x-data-grid';
 
//import Paper from '@mui/material/Paper';
import { Paper, Typography } from '@mui/material';
import { forwardRef, useRef, useImperativeHandle } from 'react';

const StyledTable= forwardRef( ({rows, columns, paginationModel , pageSizes, title="",includeCheckboxes=false},ref)=>
{
   const selectionRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getSelectedIds: () => selectionRef.current
  }));

  return (
      <Paper sx={{ minHeight: 400, width: '100%', marginBottom:'30px' , backgroundColor:"#FAF0E6" }}> 
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
          selectionRef.current = selectionModel; // מעדכן את ה-IDs
        }}
        

        sx={{ border: 0, backgroundColor:"#F8F0E3", 

          "& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitleContainer": {
              display: "flex",
              /* justifyContent: "center",*/
              width: "100%",
            },
              
            "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#EDE6D6", /*     #E1D9D1 */
            display: "flex",
             justifyContent: "center",
             color:'#644117',
             paddingLeft:'15px'
          },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                 textAlign: "center",
                  width: "100%",
              },
                      
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              paddingLeft:"15px !important"
             /* justifyContent: "center",*/
            },

                      "& .MuiDataGrid-row:hover": {
                backgroundColor: "#FAEBD7", //  "#D3E4CD
              },

               "& .MuiDataGrid-row.Mui-selected": {
                     backgroundColor:"#FFE4C4   !important",   // your selected color  #B3D9D9 "#A0D6B4 
               },

            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          },
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitle": {
            display: "none"
          },
          /* Optional: avoid empty space where the header checkbox was */
          "& .MuiDataGrid-columnHeaderCheckbox": {
            pointerEvents: "none"
          }
         }}
      />
    </Paper>
  )
});

export default StyledTable