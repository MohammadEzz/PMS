import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '@/api.config';
import { TextField,Checkbox, Select, MenuItem, FormLabel, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FormFieldError from '@/common/FormFieldError';
import { Box } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import {debounceCheckUniqueValue} from '@/helper/Debounce';
import { useNavigate } from 'react-router-dom';

export default function DrugForm(props) {
    
    const navigate = useNavigate();

    function addToDb(values) {
        props.actions.setOpenLoading(true);
        axios.post('api/v1/drugs', values)
        .then((response)=>{

            props.actions.handleAssignSavedItem(response.data.data);

            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add New Drug'
            });

            setTimeout(()=>{
                navigate("/drugs");
            }, 500);
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add New Drug'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });  
    }

    function updateToDb(values) {
        props.actions.setOpenLoading(true);
        axios.put(`api/v1/drugs/${props.savedItem.id}`, values)
        .then(()=>{   
            props.actions.handleAssignSavedItem({...props.savedItem, ...values});
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Drug'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Drug'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });  
    } 

    function checkUniqueValue(formik, field, value, fieldValueStatus) {
        axios.get(`api/v1/drugs?range=all&filter=${field}:eq[${value}]`)
        .then((response)=>{
            if(response.data.data.length === 0) {
                formik.setFieldValue(fieldValueStatus, true);
            }
            else {
                formik.setFieldValue(fieldValueStatus, false);
            }
        });
    }

    let checkUniquName = useCallback(debounceCheckUniqueValue(checkUniqueValue, 1000), []);
    let checkUniquBrandName= useCallback(debounceCheckUniqueValue(checkUniqueValue, 1000), []);
    let checkUniquBarCode = useCallback(debounceCheckUniqueValue(checkUniqueValue, 1000), []);

    let validationObject = Yup.object().shape({
        brandNameStatus: Yup.boolean(),
        nameStatus: Yup.boolean(),
        barCodeStatus: Yup.boolean(),

        name: Yup.string()
        .required("Drug Name Is Required")
        .min(4, "At Least 4 Character")
        .max(255, "At Most 255 Character")
        .when('nameStatus', {
            is: (value)=>!value===true,
            then: Yup.string().test('check-unique-name', "Drug Name Is Exist", ()=>false),
            otherwise: null,
        }),

        brandname: Yup.string()
        .nullable(true)
        .min(4, "At Least 4 Character")
        .max(255, "At Most 255 Character")
        .when('brandNameStatus', {
            is: (value)=>value,
            then: null,
            otherwise: Yup.string().test('check-unique-brandname', "Drug Brand Name Is Exist", ()=>false),
        }),

        type: Yup.number()
        .required("Please select type of drug")
        .min(1, "Please select type of drug")
        .integer("Integer Number only allowed"),

        description: Yup.string()
        .nullable(true)
        .min(4, "At Least 4 Character"),
        
        barcode: Yup.number()
        .nullable(true)
        .typeError("Barcode Not Correct")
        .min(0, "Barcode Not Correct")
        .integer("Barcode Not Correct")
        .when('barCodeStatus', {
            is: (value)=>value,
            then: null,
            otherwise: Yup.number().test('check-unique-barcode', "Barcode Is Exist", ()=>false),
        }),

        middleunitnum: Yup.number()
        .required("Middle Unit Number is Required")
        .min(1, "Number must be >= 1 or more")
        .max(100, "Number must be <= 100 or more")
        .integer("Integer Number only allowed"),

        smallunitnum: Yup.number()
        .nullable(true)
        .min(1, "Number must be >= 1 or more")
        .max(100, "Number must be <= 100 or more")
        .integer("Integer Number only allowed"),

        visible: Yup.bool()
    });

    let defaultInitialValues = {
        nameStatus: true,
        brandNameStatus: true,
        barCodeStatus: true,
        name : props.savedItem ? props.savedItem.name : '',
        brandname: props.savedItem ? (props.savedItem.brandname || '') : '',
        type: props.drugTypeOptions ? (props.savedItem ? props.savedItem.type : '') : '',
        description: props.savedItem ? (props.savedItem.description || '') : '',
        barcode: props.savedItem ? (props.savedItem.barcode || '') : '',
        middleunitnum: props.savedItem ? props.savedItem.middleunitnum : '',
        smallunitnum: props.savedItem ? (props.savedItem.smallunitnum || '') : '',
        visible: props.savedItem ? props.savedItem.visible : false,
    };

    const formik = useFormik(
        {
            initialValues: defaultInitialValues,
            enableReinitialize:true,
            validateOnChange: true,
            validationSchema: validationObject,

            onSubmit: (values)=>{
                values.created_by = 1;
                if (props.drugId) {
                    updateToDb(values, props.savedItem.id) 
                }
                else {
                    addToDb(values);
                }
            }
        }
    );

    function handleVisibleChange(e) {
        let value = e.target.checked;
        formik.setFieldValue('visible', value);        
    }

    /**
     * Store values of fileds name, brandname, barcode to
     * check if we make change on edit process or not
     * if change happen we will send value to serve to
     * check unique contraint if it's same the default value
     * not send to server and make it correct value to formik
     */
    const[editFormValue, setEditFormValue] = useState({
        'name': '',
        'brandname': '',
        'barcode': ''
    });
    useEffect(()=>{
        if(props.drugId && props.savedItem) {
            setEditFormValue({
                'name': props.savedItem['name'],
                'brandname': props.savedItem['brandname'],
                'barcode': props.savedItem['barcode'] 
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
                                value={formik.values.name}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                onChange={function(e){
                                    let value = e.target.value;
                                    console.log(value);
                                    formik.setFieldValue('name', value);
                                    formik.setFieldTouched('name', true);
                                    if(value !== undefined && value.length >=4 && value.length <= 225) {
                                        if(props.drugId && value === editFormValue['name'])
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
                            <FormLabel  htmlFor="brandname" >Brand Name</FormLabel>
                        </div>
                        <div className="field-form">
                        <TextField
                            fullWidth
                            size="small"
                            name="brandname"
                            value={formik.values.brandname}
                            error={formik.touched.brandname && Boolean(formik.errors.brandname)}
                            onChange={function(e){
                                let value = e.target.value;
                                formik.setFieldValue('brandname', value);
                                formik.setFieldTouched('brandname', true);
                                if(value !== undefined && value.length >=4 && value.length <= 225) {
                                    if(props.savedItem && value === editFormValue['brandname'])
                                        formik.setFieldValue('brandNameStatus', true);
                                    else
                                        checkUniquBrandName(formik, 'brandname', value, 'brandNameStatus');
                                }
                            }}/>
                        <FormFieldError name="brandname" formik={formik}/>
                        </div>
                    </div>
                </div>

                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="type" >Type</FormLabel>
                        </div>
                        <div className="field-form">
                        <Select 
                            size="small"
                            name="type" 
                            fullWidth
                            displayEmpty
                            error={formik.touched.type && Boolean(formik.errors.type)}
                            {...formik.getFieldProps("type")}>
                                <MenuItem  value="">
                                    <em>None</em>
                                </MenuItem>
                                    {
                                        props.drugTypeOptions
                                        &&
                                        props.drugTypeOptions.map((item)=>{
                                            return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>  
                                        })
                                    }
                            </Select>
                            <FormFieldError name="type" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="barcode">Barcode</FormLabel>
                        </div>
                        <div className="field-form">
                        <TextField
                            fullWidth
                            size="small"
                            name="barcode"
                            type="number"
                            value={formik.values.barcode}
                            error={formik.touched.barcode && Boolean(formik.errors.barcode)}
                            onChange={function(e){
                                let value = e.target.value;
                                formik.setFieldValue('barcode', value);
                                formik.setFieldTouched('barcode', true);
                                if(value !== undefined && value !== '' && value.match(/^[0-9]*$/)) {
                                    if(props.savedItem && value === editFormValue['barcode'])
                                        formik.setFieldValue('barCodeStatus', true);
                                    else
                                        checkUniquBarCode(formik, 'barcode', value, 'barCodeStatus');
                                }
                            }}/>
                        <FormFieldError name="barcode" formik={formik}/>
                        </div>
                    </div>
                </div>

                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="middleunitnum">Middle Unit Num</FormLabel>
                        </div>
                        <div className="field-form">
                            <TextField
                                fullWidth
                                size="small"
                                name="middleunitnum"
                                error={formik.touched.middleunitnum && Boolean(formik.errors.middleunitnum)}
                                {...formik.getFieldProps('middleunitnum')}/>
                            <FormFieldError name="middleunitnum" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="smallunitnum" >Small Unit Num</FormLabel>
                        </div>
                        <div className="field-form">
                            <TextField
                                fullWidth
                                size="small"
                                name="smallunitnum"
                                error={formik.touched.smallunitnum && Boolean(formik.errors.smallunitnum)}
                                {...formik.getFieldProps('smallunitnum')}/>
                            <FormFieldError name="smallunitnum" formik={formik}/>
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
                                name='description'
                                multiline
                                minRows={3}
                                maxRows={7}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                {...formik.getFieldProps('description')}/>
                            <FormFieldError name="description" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'>
                        <div className="label-form">
                        </div>
                        <div className="field-form">
                        </div>
                    </div>
                </div>

                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="visible" >Visible</FormLabel>
                        </div>
                        <div className="field-form">
                            <Checkbox 
                            sx={{marginLeft:"-10px"}}
                            name='visible'
                            checked={Boolean(formik.values.visible)}
                            onChange={handleVisibleChange}
                            />
                        </div>
                    </div>
                    <div className='unit-form'>
                        <div className="label-form">
                        </div>
                        <div className="field-form">
                        </div>
                    </div>
                </div>

                <div>
                    <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                    {
                        props.drugId
                        ?
                        <Button className="big-button" variant="contained" color="primary" type="submit">
                            Edit
                            <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                            <EditIcon />
                        </Button>
                        :
                        <Button className="big-button" variant="contained" color="success" type="submit">
                            Add New
                            <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                            <AddIcon />
                        </Button>
                    }
                    </Box>
                </div>
            </form>
        </>
    );  
}