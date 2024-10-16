import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { Button, Divider, FormLabel, TextField } from "@mui/material";
import FormFieldError from "@/common/FormFieldError";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import "@/api.config";
import {useCallback, useState, useEffect, useRef} from 'react';
import {debounceCheckUniqueValue} from '@/helper/Debounce';
import { useNavigate } from "react-router-dom";

export default function ActiveIngredientForm(props) {

    const nameFieldRef = useRef();
    const navigate = useNavigate();

    function addToDb(values) {

        props.actions.setOpenLoading(true);

        axios.post(`api/v1/activeingredients`, values)
        .then((response)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Active Ingredient'
            });

            setTimeout(()=>{
                navigate("/active-ingredients");
            }, 1000);

        })
        .catch((error)=>{
            formik.resetForm();
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

    function updateToDb(values) {
        props.actions.setOpenLoading(true);
        axios.put(`api/v1/activeingredients/${props.savedItem.id}`, values)
        .then((response)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Active Ingredient'
            });

            setTimeout(()=>{
                navigate("/active-ingredients");
            }, 1000);
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

    function checkUniqueValue(formik,field, value, fieldValueStatus) {
        return (axios.get(`api/v1/activeingredients?range=all&filter=${field}:eq[${value}]`)
        .then((response)=>{
            if(response.data.data.length === 0)
                formik.setFieldValue(fieldValueStatus, true);
            else
                formik.setFieldValue(fieldValueStatus, false);
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Some Error Happen On Server'
            });
        }));
    }

    let checkUniquName = useCallback(debounceCheckUniqueValue(checkUniqueValue, 1500), []);
    let checkUniquGlobalName= useCallback(debounceCheckUniqueValue(checkUniqueValue, 1500), []);

    const formik = useFormik({
        initialValues: {
            nameStatus: true,
            globalNameStatus: true,
            name: props.savedItem ? props.savedItem.name : '',
            globalname: props.savedItem ? props.savedItem.globalname : ''
        },

        enableReinitialize: true,

        validationSchema: Yup.object({
            nameStatus: Yup.boolean(),
            globalNameStatus: Yup.boolean(),
            name: Yup.string()
            .required("Name is required")
            .min(4, "At leat 4 character")
            .max(255, "At most 255 character")
            .when('nameStatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-name', "Name Is Exist", ()=>false),
                otherwise: null,
            }),

            globalname: Yup.string()
            .min(4, "At leat 4 character")
            .max(255, "At most 255 character")
            .when('globalNameStatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-globalname', "Global Name Is Exist", ()=>false),
                otherwise: null,
            }),
        }),

        onSubmit: (values)=>{
            if(props.activeIngredientId) {
                values.id = props.savedItem.id;
                updateToDb(values);
            }
            else
                addToDb(values);
        }
    });

    /**
     * Store values of fileds name, globalname to
     * check if we make change on edit process or not
     * if change happen we will send value to server to
     * check unique contraint if it's same the default value
     * not send to server and make it correct value to formik
     */
    const[editFormValue, setEditFormValue] = useState({
        'name': '',
        'globalname': ''
    });
    useEffect(()=>{
        if(props.savedItem) {
            setEditFormValue({
                'name': props.savedItem['name'],
                'globalname': props.savedItem['globalname'],
            });     
        }
    }, [props.savedItem]);

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                        <FormLabel  htmlFor="name" >Name</FormLabel>
                            
                        </div>
                        <div className="field-form">
                        <TextField
                                fullWidth
                                size="small"
                                name="name"
                                inputRef={nameFieldRef}
                                value={formik.values.name}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                onChange={function(e){
                                    let value = e.target.value;
                                    formik.setFieldValue('name', value);
                                    formik.setFieldTouched('name', true);
                                    if(value !== undefined && value.length >=4 && value.length <= 225) {
                                        if(props.savedItem && value === editFormValue['name'])
                                            formik.setFieldValue('nameStatus', true);
                                        else
                                            checkUniquName(formik, 'name', value, 'nameStatus');
                                    }
                                }}/>
                            <FormFieldError name="name" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'>
                        <div className="label-form">
                        <FormLabel  htmlFor="globalname">Global Name</FormLabel>
                            
                        </div>
                        <div className="field-form">
                        <TextField
                                fullWidth
                                size="small"
                                name="globalname"
                                value={formik.values.globalname}
                                error={formik.touched.globalname && Boolean(formik.errors.globalname)}
                                onChange={function(e){
                                    let value = e.target.value;
                                    formik.setFieldValue('globalname', value);
                                    formik.setFieldTouched('globalname', true);
                                    if(value !== undefined && value.length >=4 && value.length <= 225) {
                                        if(props.savedItem && value === editFormValue['globalname'])
                                            formik.setFieldValue('globalNameStatus', true);
                                        else
                                            checkUniquGlobalName(formik, 'globalname', value, 'globalNameStatus');
                                    }
                                }}/>
                            <FormFieldError name="globalname" formik={formik}/>
                        </div>
                    </div>
                </div>

                <Box sx={{display:"flex", justifyContent:"flex-end"}}>     
                    {
                        (props.activeIngredientId)
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