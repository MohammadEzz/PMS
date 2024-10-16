import { Autocomplete, Chip, TextField } from "@mui/material";
import  {  useState } from "react";
import React from "react";

export default function PurchaseReturnBillSearchBlock(props) {
    
    function handleKeyUp(event) {
        if(event.code === 'Enter' || event.code === 'NumpadEnter') {
            (event.target.value)
            ? props.actions.fetchDrugByBarCode(event.target.value)
            : alert('Barcode Not Correct');
        }
    }

    function handleOnChange(value) {
        if(value !== null && value != undefined) {
            props.actions.fetchDrugById(value.drug_id);
        }
    }

    const[searchBy, setSearchBy] = useState('barcode');
    return (
            <div className="search-block">
                {
                    (searchBy === 'name')
                    ?
                    <Autocomplete
                            size='small'
                            name="durgname"
                            getOptionLabel={(option)=>option.name}
                            options={props.drugOptions || []}
                            placeholder="Select Drug ..."
                            onChange={(e,value)=>{handleOnChange(value);}}
                            isOptionEqualToValue={(option, value)=> option.id === value.id}
                            renderInput={(params) => <TextField 
                                {...params}
                                sx={{width: "300px"}}
                                size='small'
                            />}
                        />
                    :
                    <TextField
                        fullWidth
                        size="small"
                        name="drugcode"
                        onKeyUp={handleKeyUp}
                        sx={{width: "300px"}}
                    />
                }
                
                <Chip sx={{ml:"5px"}} 
                variant={(searchBy === 'barcode') ? "contained" : "outlined"} 
                color="primary" 
                label="Barcode" 
                onClick={()=>setSearchBy('barcode')}
                />
                <Chip 
                sx={{ml:"5px"}} 
                variant={(searchBy === 'name') ? "contained" : "outlined"} 
                color="primary" 
                label="Drug Name"
                onClick={()=>setSearchBy('name')}
                />
            </div>
    );
}