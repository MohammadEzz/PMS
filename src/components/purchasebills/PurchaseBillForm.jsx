import {useEffect} from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Autocomplete, Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import FormFieldError from "../../common/FormFieldError";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from "@mui/system";
import  AddIcon  from '@mui/icons-material/Add';
import  EditIcon  from '@mui/icons-material/Edit';
import axios from "axios";
import  "@/api.config";

export default function PurchaseBillForm(props) {

    function addToDb(values) {
        props.actions.setOpenLoading(true);
        axios.post(`api/v1/purchases`, values)
        .then((response)=>{
            values.id = response.data.data.id;
            props.actions.handleAssignSavedItem(values);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Purchase Bill'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Purchase Bill'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    function updateToDb(values) {
        props.actions.setOpenLoading(true);
        axios.put(`api/v1/purchases/${props.savedItem.id}`, values)
        .then(()=>{
            props.actions.handleAssignSavedItem({...props.savedItem, ...values});
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Purchase Bill'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Purchase Bill'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    const formik = useFormik({
        initialValues: {
            supplier_id: props.savedItem ? props.savedItem.supplier_id : null,
            dealer_id: props.savedItem ? props.savedItem.dealer_id : null,
            billnumber: props.savedItem ? props.savedItem.billnumber : '',
            issuedate: props.savedItem ? props.savedItem.issuedate : null,
            paymenttype: props.savedItem ? props.savedItem.paymenttype : ''
        },
        enableReinitialize: true,
        validateOnChange: true,

        validationSchema: Yup.object({
            supplier_id: Yup.number()
            .typeError("Supplier is Required")
            .required("Supplier is Required"),

            dealer_id: Yup.number()
            .typeError("Dealer is Required")
            .required("Dealer is Required"),

            billnumber: Yup.number()
            .typeError("Only Numbers are Allowed")
            .required("Bill Number is Required")
            .min(0, "Bill Number Not Correct"),

            issuedate: Yup.date()
            .required("Issue Date is Required")
            .typeError("Issue Date Not Valid")
            .max(new Date(), 'Issue Date > today'),

            paymenttype: Yup.string()
            .required("Payment Type is Requried"),
        }),

        onSubmit:  (values)=>{
            props.purchaseBillId
            ?
            updateToDb(values)
            :
            addToDb(values);
        }
    });

    /*************************
     * Handle Supplier Field
     *************************/
     function handeSupplierChange(event, option) {
        const value = option ? option.id : null;
        formik.setFieldValue('supplier_id', value);      
        formik.setFieldValue('dealer_id', null);      
        value && props.actions.fetchDealerRelatedToSupplierOptions(value); 
        setTimeout(()=>{formik.validateField('supplier_id')});   
     }

     // initialze Supplier when Add/Edit Purchase Bill
     useEffect(()=>{
         let supplierValue = props.savedItem ? props.savedItem.supplier_id : null;
         formik.setFieldValue('supplier_id', supplierValue);
     }, [props.savedItem]);

     function handleDealerChange(event, option) {
        const value = option ? option.id : null;
        formik.setFieldValue('dealer_id', value);      
        setTimeout(()=>{formik.validateField('dealer_id')});   
     }

     // initialze Dealer when Add/Edit Purchase Bill
     useEffect(()=>{
        if(props.savedItem) {
            let dealerValue = props.savedItem.dealer_id;
            formik.setFieldValue('dealer_id', dealerValue);
        }
    }, [props.savedItem]);
 
    function handleIssueDate(value) {
        formik.setFieldValue('issuedate', value);     
        setTimeout(()=>{formik.validateField('issuedate')});   
    }

    function handlePaymentTypeChange(event) {
        formik.setFieldValue('paymenttype', event.target.value);   
        setTimeout(()=>{formik.validateField('paymenttype')});     
    }

    return (
        <>
        <form onSubmit={formik.handleSubmit}>
            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="supplier_id">Supplier</FormLabel>
                    </div>
                    <div className="field-form">
                        <Autocomplete
                            size='small'
                            name="supplier_id"
                            value={ props.supplierOptions.find((option) => +option.id === +formik.values.supplier_id) || null }
                            getOptionLabel={(option)=>option.name}
                            options={props.supplierOptions || []}
                            isOptionEqualToValue={(option, value)=> option.id === value.id}
                            onChange = {handeSupplierChange}
                            renderInput={(params) => <TextField 
                                {...params}
                                className="text-field-auto"
                                error={formik.touched.supplier_id && Boolean(formik.errors.supplier_id)}
                                size='small'
                            />}
                        />
                        <FormFieldError name="supplier_id" formik={formik}/>
                    </div>
                </div>

                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="dealer_id">Dealer</FormLabel>                
                    </div>
                    <div className="field-form">
                        <Autocomplete
                        size='small'
                        name="dealer_id"
                        disabled={formik.values.supplier_id ? false : true}
                        value={ props.dealerOptions ? (props.dealerOptions.find((option) => +option.id === +formik.values.dealer_id) || null) : null }
                        getOptionLabel={(option)=>option.name}
                        options={props.dealerOptions || []}
                        isOptionEqualToValue={(option, value)=> option.id === value.id}
                        onChange = {handleDealerChange}
                        renderInput={(params) => <TextField 
                            {...params}
                            className="text-field-auto"
                            size='small'
                            error={formik.touched.dealer_id && Boolean(formik.errors.dealer_id)}
                            />}
                        />
                        <FormFieldError name="dealer_id" formik={formik}/>
                    </div>
                </div> 
            </div>
            <div className='row-form'> 
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="dealer_id">Issue Date</FormLabel>                
                    </div>
                    <div className="field-form">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                maxDate={new Date()}
                                views={['year', 'month', 'day']}
                                openTo="day"
                                value={(formik.values.issuedate) ? new Date(formik.values.issuedate) : null}
                                onChange={handleIssueDate}
                                inputFormat="dd/MM/yyyy"
                                type="date"
                                renderInput={(params) => <TextField 
                                    {...params} 
                                    fullWidth
                                    type="date"
                                    size="small"
                                    error={formik.touched.issuedate && Boolean(formik.errors.issuedate)}
                                />} 
                            />
                        </LocalizationProvider>
                        <FormFieldError name="issuedate" formik={formik}/>
                    </div>
                </div> 

                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="dealer_id">Bill Number</FormLabel>                
                    </div>
                    <div className="field-form">
                        <TextField
                        fullWidth
                        size="small"
                        name="billnumber"
                        error={formik.touched.billnumber && Boolean(formik.errors.billnumber)}
                        {...formik.getFieldProps('billnumber')}/>
                        <FormFieldError name="billnumber" formik={formik}/>
                    </div>
                </div>
            </div>   
            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="paymenttype" >Payment Type</FormLabel>             
                    </div>
                    <div className="field-form">
                        <RadioGroup row value={formik.values.paymenttype} aria-label="paymenttype" name="paymenttype" onChange={handlePaymentTypeChange}>
                            <FormControlLabel value="prepaid" label="Pre Paid" control={<Radio size='small' />} />
                            <FormControlLabel value="postpaid" label="Post Paid" control={<Radio size='small' />} />
                        </RadioGroup>
                        <FormFieldError name="paymenttype" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>
            <div>
                <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                    {
                        props.purchaseBillId
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