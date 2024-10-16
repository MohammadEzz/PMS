import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { Button, Divider, FormLabel, MenuItem, Select, TextField } from "@mui/material";
import FormFieldError from "../../common/FormFieldError";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import "@/api.config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DrugInteractionForm(props) {

   
    const [interactionsList1, setInteractionsList1] = useState([]);
    const [interactionsList2, setInteractionsList2] = useState([]);
    const navigate = useNavigate();

    function addToDb(values) {

        props.actions.setOpenLoading(true);

        axios.post(`api/v1/druginteractions`, values)
        .then((response)=>{
            formik.resetForm();
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Drug Interaction'
            });

            setTimeout(()=>{
                navigate("/interactions");
            }, 500);
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Drug Interaction'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false)
        });
    }

    function updateToDb(values) {

        props.actions.setOpenLoading(true);

        axios.put(`api/v1/druginteractions/${props.savedItem.id}`, values)
        .then((response)=>{
            fetchActiveIngredientInteractionFromDB(formik.values.activeingredient1);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Drug Interaction'
            });

            setTimeout(()=>{
                navigate("/interactions");
            }, 500);
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Drug Interaction'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    const formik = useFormik({
        initialValues: {
            activeingredient1: props.savedItem ? props.savedItem.activeingredient1 : '',
            activeingredient2: props.savedItem ? props.savedItem.activeingredient2 : '',
            level: props.savedItem ? props.savedItem.level : '',
            description: props.savedItem ? props.savedItem.description : ''
        },

        enableReinitialize: true,
        
        validationSchema: Yup.object({
            activeingredient1: Yup.number()
            .required("Please Select First Active Ingredient")
            .min(1, "Please Select First Active Ingredient")
            .integer(),

            activeingredient2: Yup.number()
            .required("Please Select Second Active Ingredient")
            .min(1, "Please Select Second Active Ingredient")
            .integer(),
    
            level: Yup.number()
            .required("Please Select Level")
            .min(1, "Please Select Level")
            .integer(),
    
            description: Yup.string()
            .required("Description is required")
            .min(4, "Al least 4 character"),    
        }),
        onSubmit: (values)=>{
            if(props.drugInteractionId) {
                values.id = props.drugInteractionId;
                updateToDb(values);
            }
            else {
                addToDb(values);
            }
        }
    });
    
    function fetchActiveIngredientInteractionFromDB(value) {

        props.actions.setOpenLoading(true);

        axios.get(`api/v1/activeingredients/${value}/interactions`)
        .then((response)=>{
            setInteractionsList1(response.data.data[0]);
            setInteractionsList2(response.data.data[1]);
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    function handleActiveIngredient1Change(event) {
        formik.setFieldValue('activeingredient1', event.target.value);
        formik.setFieldValue('activeingredient2', []);
        
        (event.target.value) && fetchActiveIngredientInteractionFromDB(event.target.value);
    }

    useEffect(()=>{
        if(props.drugInteractionId && props.savedItem) {
            const value = props.savedItem.activeingredient1 || '';
            formik.setFieldValue('activeingredient1', value);
            fetchActiveIngredientInteractionFromDB(value);
        }
    }, [props.drugInteractionId, props.savedItem]);

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="activeingredient1">Active Ingredient 1</FormLabel>
                        </div>
                        <div className="field-form">
                            <Select 
                                size="small"
                                id="activeingredient1" 
                                name="activeingredient1" 
                                fullWidth
                                displayEmpty
                                value={formik.values.activeingredient1}
                                error={formik.touched.activeingredient1 && Boolean(formik.errors.activeingredient1)}
                                onChange = {handleActiveIngredient1Change}>
                                    <MenuItem  value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        Array.isArray(props.activeIngredientOptions)
                                        &&
                                        props.activeIngredientOptions.map((item)=>{
                                            return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>  
                                        })
                                    }
                            </Select>
                            <FormFieldError name="activeingredient1" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="activeingredient2">Active Ingredient 2</FormLabel>                        
                        </div>
                        <div className="field-form">
                            <Select 
                                size="small"
                                id="activeingredient2" 
                                name="activeingredient2" 
                                fullWidth
                                displayEmpty
                                disabled={formik.values.activeingredient1 ? false : true}
                                error={formik.touched.activeingredient2 && Boolean(formik.errors.activeingredient2)}
                                {...formik.getFieldProps("activeingredient2")}>
                                
                                    <MenuItem  value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        Array.isArray(props.activeIngredientOptions)
                                        &&
                                        props.activeIngredientOptions.map((item)=>{
                                            if(item.id !== formik.values.activeingredient1) {
                                                let disableStatue1 = interactionsList1.find((interactionItem)=>item.id === interactionItem.activeingredient2);
                                                let disableStatue2 = interactionsList2.find((interactionItem)=>item.id === interactionItem.activeingredient1);
                                                return <MenuItem disabled={ (disableStatue1 || disableStatue2) ? true : false } key={item.id} value={item.id}>{item.name}</MenuItem>  
                                            }
                                        })
                                    }
                                </Select>
                                <FormFieldError name="activeingredient2" formik={formik}/>
                            </div>
                        </div>
                    </div>

                    <div className='row-form'>
                        <div className='unit-form'>
                            <div className="label-form">
                                <FormLabel  htmlFor="activeingredient2">Level</FormLabel>                                                   
                            </div>
                            <div className="field-form">
                                <Select 
                                    size="small"
                                    id="level" 
                                    name="level" 
                                    fullWidth
                                    displayEmpty
                                    error={formik.touched.level && Boolean(formik.errors.level)}
                                    {...formik.getFieldProps("level")}>
                                        <MenuItem  value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            Array.isArray(props.drugInteractionLevelOptions) 
                                            && 
                                            props.drugInteractionLevelOptions.map((item)=>{
                                                return (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                );
                                            })
                                        }
                                </Select>
                                <FormFieldError name="level" formik={formik}/>
                            </div>
                        </div>
                        <div className='unit-form'></div>
                    </div>

                    <div className='row-form'>
                        <div className='unit-form'>
                            <div className="label-form">
                                <FormLabel htmlFor="description" >Description</FormLabel>                            
                            </div>
                            <div className="field-form">
                                <TextField
                                    fullWidth
                                    size="small"
                                    id='description'
                                    name='description'
                                    multiline
                                    minRows={3}
                                    maxRows={7}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    {...formik.getFieldProps('description')}/>
                                <FormFieldError name="description" formik={formik}/>
                            </div>
                        </div>
                        <div className='unit-form'></div>
                    </div>

                    <Box sx={{display:"flex", justifyContent:"flex-end"}}>     
                    {
                        props.drugInteractionId
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
        </>
    );
}