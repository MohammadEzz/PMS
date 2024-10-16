import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import "@/api.config";
import { Button, Divider, FormLabel, MenuItem, Select, TextField } from "@mui/material";
import FormFieldError from "../../common/FormFieldError";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
  
export default function ActiveingredientForm(props) {

    function addToDb(data) {
        props.actions.setOpenLoading(true);
        axios.post(`api/v1/drugs/${data.drug_id}/activeingredients`, data)
        .then((response)=>{
            props.actions.addActiveIngredient(response.data.data);
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
        axios.put(`api/v1/drugs/${data.drug_id}/activeingredients/${props.editItem.id}`, data)
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
            activeingredient_id: (props.activeIngredientOptions) ? ((props.editItem) ? props.editItem.id : '') : '',
            concentration: (props.editItem) ? (props.editItem.pivot.concentration || '') : '',
            format: (props.editItem) ? (props.dosageOptions ? (props.editItem.pivot.format || '') : '') : '',
        },
        
        enableReinitialize:true,

        validationSchema: Yup.object({
            activeingredient_id: Yup.number()
            .required("Active Ingredient Is Required")
            .min(1, "Active Ingredient Is Required")
            .integer("Active Ingredient Is Required"),

            concentration: Yup.number()
            .nullable(true)
            .typeError('Only Numbers Are Allowed')
            .min(0, "Concentration Not Correct"),

            format: Yup.number()
            .nullable(true)
            .typeError("Format Not Correct")
            .min(1, "Format Not Correct")
        }),

        onSubmit: (values)=>{
            values.order = 1;
            values.drug_id = props.drugId;

            if(!props.editItem)
                addToDb(values)
            else {
                updateToDb(values);
            }
        }
    });

    return (
        <>
          <form onSubmit={formik.handleSubmit}>
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel htmlFor="activeingredient_id">Active Ingredient</FormLabel>   
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
                                    
                                    props.activeIngredientOptions.map((item)=>{
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

                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="format">Dosage Standard</FormLabel>
                        </div>
                        <div className="field-form">
                            <Select 
                                size="small"
                                id="format" 
                                name="format"
                                fullWidth 
                                displayEmpty
                                error={formik.touched.format && Boolean(formik.errors.format)}
                                {...formik.getFieldProps("format")}>
                                <MenuItem  value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    props.dosageOptions.map((item)=>{
                                        return (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        );
                                    })
                                }
                            </Select>
                            <FormFieldError name="format" formik={formik}/>
                        </div>
                    </div>
                </div>

                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="concentration">Concentration</FormLabel>    
                        </div>
                        <div className="field-form">
                            <TextField
                                fullWidth
                                size="small"
                                id="concentration"
                                name="concentration"
                                error={formik.touched.concentration && Boolean(formik.errors.concentration)}
                                {...formik.getFieldProps('concentration')}/>
                            <FormFieldError name="concentration" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'></div>
                </div>

                <Box sx={{display:"flex", justifyContent:"flex-end"}}>      
                    {
                        (!props.editItem)
                        ?
                        <Button className="big-button" variant="contained" color="success" type="submit">
                            Add New
                            <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                            <AddIcon />
                        </Button>    
                        :
                        <Button className="big-button" variant="contained" color="primary" type="submit">
                            Edit
                            <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                            <EditIcon size="small"/>
                        </Button>                                              
                    }                         
                </Box>
        </form>
        </>
    );
}