import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { Button, Divider, FormLabel, Grid, MenuItem, Select, TextField } from "@mui/material";
import FormFieldError from "@/common/FormFieldError";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import "@/api.config";
import { useEffect } from "react";

export default function ContraindicationForm(props) {

    function addToDb(values) {

        props.actions.setOpenLoading(true);

        axios.post(`api/v1/drugs/${values.drug_id}/contraindications`, values)
        .then((response)=>{
            props.actions.addContraindication(response.data.data);
            formik.resetForm();
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Contrandicaion'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Contrandicaion'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    function updateToDb(data) {

        props.actions.setOpenLoading(true);

        axios.put(`api/v1/drugs/${data.drug_id}/contraindications/${props.editItem.id}`, data)
        .then((response)=>{
            props.actions.editContraindication(response.data.data);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Contrandicaion'
            });
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Contrandicaion'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    const formik = useFormik({
        initialValues: {
            category: props.editItem ? props.editItem.categoryid : '',
            level: props.editItem ? props.editItem.levelid : '',
            description: props.editItem ? props.editItem.description : '',
        },

        enableReinitialize: true,

        validationSchema: Yup.object({
            category: Yup.number()
            .required("Please Select Category")
            .min(1, "Please Select Category")
            .integer(),
    
            description: Yup.string()
            .required("Description is Required")
            .min(4, "At leat 4 character"),
    
            level: Yup.number()
            .required("Please Select Level")
            .min(1, "Please Select Level")
            .integer(),
        }),
        onSubmit: (values)=>{
            values.order = 12;
            values.drug_id = props.drugId;
            if(props.editItem) {
                values.id = props.editItem.id;
                updateToDb(values)
            }
            else {
                addToDb(values);
            }          
        }
    });

    return(
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="category">Category</FormLabel>
                        </div>
                        <div className="field-form">
                        <Select 
                            size="small"
                            id="category" 
                            name="category" 
                            fullWidth
                            displayEmpty
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            {...formik.getFieldProps("category")}>
                            <MenuItem  value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                props.contraindicationCategoryOptions.map((item)=>{
                                    return (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                        <FormFieldError name="category" formik={formik}/>
                        </div>
                    </div>

                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="level">Level</FormLabel>
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
                                    props.contraindicationLevelOptions.map((item)=>{
                                        return (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        );
                                    })
                                }
                            </Select>
                            <FormFieldError name="level" formik={formik}/>
                        </div>
                    </div>
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
        </>
    );  
}