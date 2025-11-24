import { useState } from "react";
import { Box, TextField, Tooltip,Button } from "@mui/material";
import { validateCategoryName } from "../utils/validateCategory";
import { requestCategoryRemove, requestCategoryUpdate,requestCategoryAdd } from '../utils/categoryRequests';

export const useEditableCategory = () => {
  const [editValues, setEditValues] = useState({});  // a map , each id points to the updated value 
  const [updateErrors, setUpdateErrors] = useState({}); // a map , each id points to the error of this row
  const [rows, setRows] = useState([]);

  const handleAddCategory = async (name, setError) => {
    try {
      const resp = await requestCategoryAdd({ categoryName: name });
      if (resp.ok)
      {
        setRows(prev => [...prev, { id: resp.data.categoryData._id, categoryName: name }]);
        return true;
      } 
      else 
      {
        throw resp;
      }
    } 
    catch (err)
     {
      setError("root", { type: "server", message: err.message || "Adding failed" });
      return false;
    }
  };

  const editUpdateClickHandler = async (isEditMode,params) =>
  {

    if (isEditMode) // when "Update" is clicked , we have a final value
    {           
      const newValue = editValues[params.row.id];
      const errorMessage = validateCategoryName(newValue);
      if (errorMessage) 
      {
          setUpdateErrors(prev => ({ ...prev, [params.row.id]: errorMessage }));
          return; // stop update
      }

      const resp = await  requestCategoryUpdate( params.row.id,editValues[params.row.id] );
      if ( resp.ok)
      { 
           // Update the row in your rows state
            const updatedRows = rows.map((row) => row.id === params.row.id ? { ...row, categoryName: editValues[params.row.id] }: row );
            setRows(updatedRows);

            // remove server-side error
            setUpdateErrors((prev) => {
                          const copy = { ...prev };
                          delete copy[params.row.id];
                          return copy;
                        });

            // Remove this row from editValues to exit edit mode
            setEditValues((prev) => {
                        const copy = { ...prev };
                        delete copy[params.row.id];
                        return copy;
                      });
      }
      else // requestCategoryUpdate failed .....
      {
        console.log("setting errors");
        setUpdateErrors((prev) => ({ ...prev, [params.row.id]: resp.message || "Update failed" }));
      }  
    }                        
    else  // when "Edit" is clicked , we need to add the editable id to the editValues object 
    {
        setEditValues((prev) => ({
                            ...prev,
                            [params.row.id]: params.row.categoryName,
                          }));
    }   

  }

  const renderEditUpdateButton = (params) =>
    {
    const isEditMode = editValues.hasOwnProperty(params.row.id); 

        return <Button
          variant="contained"
          size="small"
          onClick={ async () => { await editUpdateClickHandler(isEditMode,params); } }
          sx={{ backgroundColor:"#4E9258" }}
        >
        {  isEditMode ? 'Update':'Edit' }
        </Button>
  }

  const removeClickHandler = async (params) =>{

     const resp = await requestCategoryRemove(params.row.id);        
          if (resp.ok)
          {
               setRows( (prev)=>{
                      const afterRemoval = [...prev].filter( (element)=>{ return element.id !== params.row.id});
                       return afterRemoval;
               })
          }
          else
          {
              console.log("Removing category failed")
          }

  }

  const renderRemoveButton = (params) => (
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={ async () => {
          
        await removeClickHandler(params);     
        }}
        sx={{ backgroundColor:"#CB6D51" }}
      >
        Remove
      </Button>
    )
  
  const renderCategoryName = (params) =>
  {
              const isEditMode = editValues.hasOwnProperty(params.row.id); 
             if (isEditMode)
             {
                const error = updateErrors[params.row.id];
                return   <Box  sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                 <Tooltip
                    title={error || ""}
                    open={!!error}
                    placement="bottom"
                    arrow
                  >
                 <TextField  sx={{
                                          "& .MuiInputBase-input": {
                                            textAlign: "center",
                                          },
                                        }}
                                        required
                                        size="small"                                        
                                        value={editValues[params.row.id]} // <-- bind to state
                                          onChange={(e) => {                                            
                                          setEditValues((prev) => ({...prev,[params.row.id]: e.target.value})) ;   
                                          setUpdateErrors(prev => { const copy = { ...prev }; delete copy[params.row.id];return copy;});
                                        }}                         
                      />
                  </Tooltip>
                </Box>

             }
             else
             {
                 return params.row.categoryName;
             }

   }

  return { rows, setRows, editValues, setEditValues, updateErrors, setUpdateErrors, renderCategoryName ,renderEditUpdateButton, renderRemoveButton,handleAddCategory};
};
