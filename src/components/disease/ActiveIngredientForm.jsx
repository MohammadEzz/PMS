import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import "@/api.config";
import { Button, Divider, FormLabel, MenuItem, Select } from "@mui/material";
import FormFieldError from "@/common/FormFieldError";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";

export default function ActiveingredientForm(props) {
    
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    function addToDb(data) {
        props.actions.setOpenLoading(true);
        axios.post(`api/v1/diseases/${props.diseaseId}/activeingredients`, data)
        .then((response)=>{
            props.actions.addActiveIngredient(response.data.data[0]); 
            formik.resetForm(); 
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Active Ingredient'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Active Ingredient'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    function updateToDb(data) {
        props.actions.setOpenLoading(true);
        axios.put(`api/v1/diseases/${props.diseaseId}/activeingredients/${props.editItem.id}`, data)
        .then((response)=>{
            props.actions.editActiveIngredient(response.data.data);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Active Ingredient'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Active Ingredient'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    const formik = useFormik({
        initialValues: {
            activeingredient_id: (props.editItem) ? props.editItem.id : '',
        },

        validationSchema: Yup.object({
            activeingredient_id: Yup.number()
            .required("Please select Active Ingredient")
            .min(1, "Please select Active Ingredient")
            .integer(),
        }),

        onSubmit: (values)=>{
            values.order = 5;
            if(!props.editItem)
                addToDb(values)
            else {
                updateToDb(values);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                    <FormLabel  htmlFor="activeingredient_id">Active Ingredient</FormLabel>
                        
                    </div>
                    <div className="field-form">
                    <Select 
                        size="small"
                        id="activeingredient_id" 
                        name="activeingredient_id" 
                        fullWidth
                        displayEmpty
                        error={formik.touched.activeingredient_id && Boolean(formik.errors.activeingredient_id)}
                        {...formik.getFieldProps("activeingredient_id")}>
                            <MenuItem  value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                Array.isArray(props.activeIngredientOptions) && props.activeIngredientOptions.map((item)=>{
                                    const disableStatue = props.data.find((activeIngredientItem)=>item.id === activeIngredientItem.id);
                                    return (
                                        <MenuItem disabled={disableStatue ? true : false } key={item.id} value={item.id}>{item.name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                    <FormFieldError name="activeingredient_id" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <Box sx={{display:"flex", justifyContent:"flex-end"}}>     
                {
                    (props.editItem)
                    ?
                    <Button className="big-button" variant="contained" color="primary" type="submit">
                        Edit
                        <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                        <EditIcon size="small"/>
                    </Button>
                    :
                    <Button className="big-button" variant="contained" color="success" type="submit">
                        Add New
                        <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                        <AddIcon />
                    </Button>                                               
                }                         
            </Box>
        </form>
    );
}