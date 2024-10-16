import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@mui/material';
import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, isValid, addYears } from 'date-fns';
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import  "@/api.config";;

function checkInteger(value) {
    let reg = /^\d*$/;
    if((value).match(reg)) return true;
    return false;
}

function checkDecimal(value) {
    let reg = /^\d*\.?\d*$/;
    if((value).match(reg)) return true;
    return false;
}

function checkDateValidate(value) {
    return (isValid(new Date(value))) ? true : false;
}

export default function PurchaseBillItems(props) {

    const[editMode, setEditMode] = useState(false);
    const[billItemData, setbillItemData] = useState(null);

    function resetBillForm() {
        setEditMode(false);
        setbillItemData(null); 
    }

    function addToDb(values) {
        props.actions.setOpenLoading(true);
        axios.post(`api/v1/purchases/items`, values)
        .then((response)=>{
            props.actions.handleChangeOnRows(response.data.data); 
            props.actions.handleAssignBillTotal(response.data.data.totalbill);  
            resetBillForm();
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Bill Item'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Bill Item'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    function updateToDb(values) {
        props.actions.setOpenLoading(true);
        axios.put(`api/v1/purchases/items/${billItemData.id}`, values)
        .then((response)=>{
            props.actions.handleChangeOnRows(response.data.data);   
            props.actions.handleAssignBillTotal(response.data.data.totalbill); 
            resetBillForm();  
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Bill Item'
            });
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Bill Item'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    } 

    function checkIfItemPersistOnDB(id) {
        return (id) ? true : false;
    }

    function deleteItemFromBill(itemInfo) {
        props.actions.setOpenLoading(true);
        if(checkIfItemPersistOnDB(itemInfo.id)){
            axios.delete(`api/v1/purchases/items/${itemInfo.id}`)
            .then((response)=>{
                props.actions.handleDeleteItemFromBill(itemInfo);   
                props.actions.handleAssignBillTotal(response.data.data.totalbill);
                resetBillForm();  
                props.actions.setAlertObj({
                    open: true,
                    type: 'success',
                    message: 'Successfully Delete Item From Bill'
                });
            })
            .catch(()=>{
                props.actions.setAlertObj({
                    open: true,
                    type: 'error',
                    message: 'Failed Delete Item From Bill'
                });
            })
            .finally(()=>{
                props.actions.setOpenLoading(false);
            }); 
        }
        else {
            props.actions.handleDeleteItemFromBill(itemInfo);  
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Item From Bill'
            });
            props.actions.setOpenLoading(false);
        }
    }

    function checkActionIsUpdate(rowData){
        let isActionIsUpdate = (rowData.id) ? true : false;
        return isActionIsUpdate;
    }
    
    const formik = useFormik({
        initialValues: {
            drugid: '',
            quantity: '',
            bonus: '',
            exdate: '',
            sprice : '',
            discount : '',
            tax : '',
            pprice:  '',
        },
        enableReinitialize: true,
        validateOnChange: true,

        validationSchema: Yup.object({
            quantity: Yup.number()
            .typeError("Required")
            .required('Required')
            .integer('Only Int')
            .min(1, "num >= 1"),

            exdate: Yup.date()
            .typeError("Not Valid")
            .required('Required')
            .min(new Date(), "Date < Today")
            .max(new Date('2099-01-01'), "Date > 2099"),

            bonus: Yup.number()
            .typeError("Required")
            .required('Required')
            .integer('Only Int')
            .min(0, "num >= 0"),

            sprice: Yup.number()
            .typeError("Required")
            .required('Required')
            .min(0, "num >= 0"),

            discount: Yup.number()
            .typeError("Required")
            .required('Required')
            .min(0, "num >= 0"),

            tax: Yup.number()
            .typeError("Required")
            .required('Required')
            .min(0, "num >= 0"),
        }),
        onSubmit: (values)=>{
            console.log(values);
            values = {
                purchasebill_id: props.purchaseBillId,
                drug_id: values.drugid,
                quantity: values.quantity,
                bonus: values.bonus,
                sellprice: values.sprice,
                tax: values.tax,
                discount: values.discount,
                expiredate: values.exdate,
            }

            const isActionToUpdate = checkActionIsUpdate(billItemData);
            (isActionToUpdate) ? updateToDb(values) : addToDb(values);
        }
    });
    
    function handleEditDataItemOnBill(event) {
        if(event.code === 'Enter' || event.code === 'NumpadEnter') {
            formik.submitForm();
        }
    }

    function handleChangeIntegerField(event) {
        if(checkInteger(event.target.value)) {
            formik.setFieldValue(event.target.name, event.target.value);
            formik.setFieldTouched(event.target.name, true);
            setTimeout(()=>{formik.validateField(event.target.name)});
        }
    }

    function handleChangeDecimalField(event) {
        if(checkDecimal(event.target.value)) {
            formik.setFieldValue(event.target.name, event.target.value);
            formik.setFieldTouched(event.target.name, true);
            setTimeout(()=>{formik.validateField(event.target.name)});
        }
    }

    function handleChangeExpireDate(value) {
        let formatDateValue = (checkDateValidate(value) && value !== null)
        ? format(new Date(value), 'yyyy-MM-dd') 
        : '';
        formik.setFieldValue('exdate', formatDateValue);
        formik.setFieldTouched('exdate', true);
        setTimeout(()=>{formik.validateField('exdate')});
    }

    return(
        <>
            <Table className="bill-style">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight:"bold", width:'30px'}}></TableCell>
                        <TableCell style={{fontWeight:"bold", width:'30px'}}>#</TableCell>
                        <TableCell style={{fontWeight:"bold", width: '150px'}} align="left">Drug Name</TableCell>
                        <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Quantity</TableCell>
                        <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Bonus</TableCell>
                        <TableCell style={{fontWeight:"bold", width: '100px'}} align="center">Ex-Date</TableCell>
                        <TableCell style={{fontWeight:"bold", width: '50px'}} width={3} align="center">S-Price</TableCell>
                        <TableCell style={{fontWeight:"bold", backgroundColor:'#F7D7D7', width: '50px'}} align="center">Discount(%)</TableCell>
                        <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Tax(%)</TableCell>
                        <TableCell style={{fontWeight:"bold", backgroundColor:'#fffbc5', width: '50px'}} align="center">P-Price</TableCell>
                        <TableCell style={{fontWeight:"bold", backgroundColor:'#D4EEE3', width: '100px'}} align="center">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {props.rows && props.rows.map((row, index) => (
                    <TableRow
                    key={row.drugid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onDoubleClick={()=>{
                        if(billItemData == null || row.drugid !== billItemData.drugid) {
                            setEditMode(true);
                            setbillItemData(row);
                            formik.resetForm();
                            formik.setFieldValue('drugid', row.drugid);
                            formik.setFieldValue('quantity', row.quantity);
                            formik.setFieldValue('bonus', row.bonus);
                            formik.setFieldValue('exdate', row.exdate || format(new Date(), 'yyyy-MM-dd'));
                            formik.setFieldValue('sprice', row.sprice);
                            formik.setFieldValue('discount', row.discount);
                            formik.setFieldValue('tax', row.tax);
                        }       
                    }}
                    >
                    <TableCell><DeleteForeverIcon onClick={()=>{deleteItemFromBill(row)}} color="error" fontSize="small" sx={{cursor:'pointer'}}/></TableCell>
                    <TableCell component="th" scope="row">
                        {index+1}
                    </TableCell>
                    <TableCell  align="left">{row.name}</TableCell>
                    <TableCell  align="center">
                        {
                            (editMode && billItemData.drugid === row.drugid)
                            ? 
                            <>
                                <TextField 
                                name="quantity" 
                                {...formik.getFieldProps('quantity')}
                                onChange={(event)=>{handleChangeIntegerField(event)}}
                                onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                                className='field-inside-cell' />

                                {
                                    (formik.touched.quantity && Boolean(formik.errors.quantity)) && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.quantity}</div>
                                }
                            </>
                            : 
                            row.quantity
                        }
                    </TableCell>
                    <TableCell align="center">
                        {
                            (editMode && billItemData.drugid === row.drugid)
                            ? 
                            <>
                                <TextField 
                                name="bonus" 
                                {...formik.getFieldProps('bonus')}
                                onChange={(event)=>{handleChangeIntegerField(event)}}
                                onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                                className='field-inside-cell' />

                                {(formik.touched.bonus && Boolean(formik.errors.bonus)) 
                                && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.bonus}</div>}
                            </>
                            : 
                            row.bonus
                        }
                    </TableCell>
                    <TableCell  align="center">
                        {
                            (editMode && billItemData.drugid === row.drugid)
                            ?
                            <>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['year', 'month', 'day']}
                                        openTo="month"
                                        name="exdate"
                                        disablePast
                                        size="small"
                                        {...formik.getFieldProps('exdate')}
                                        value={row.exdate ? new Date(row.exdate) : null}
                                        onChange={handleChangeExpireDate} 
                                        inputFormat="dd/MM/yyyy"
                                        mask='__/__/__'
                                        renderInput={(params) => <TextField 
                                            {...params} 
                                            name='formtext'
                                            onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                                            className="field-inside-cell date"
                                            error={(formik.touched.exdate) && Boolean(formik.errors.exdate)}
                                            size="small" />} 
                                    />
                                </LocalizationProvider>

                                {
                                (formik.touched.exdate && Boolean(formik.errors.exdate)) && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.exdate}</div>
                                }
                            </> 
                            : 
                            (row.exdate) ? format(new Date(row.exdate), 'dd/MM/yyyy') : '-'
                        }
                    </TableCell>
                    <TableCell  align="center">
                        {
                            (editMode && billItemData.drugid === row.drugid)
                            ? 
                            <>
                                <TextField
                                name="sprice" 
                                {...formik.getFieldProps('sprice')}
                                onChange={(event)=>{handleChangeDecimalField(event)}}
                                onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                                className='field-inside-cell' />

                                {(formik.touched.sprice && Boolean(formik.errors.sprice)) 
                                && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.sprice}</div>}
                            </>
                            : 
                            row.sprice
                        }
                    </TableCell>
                    <TableCell  style={{backgroundColor:'#F7D7D7', textAlign:'center'}}>
                        {
                            (editMode && billItemData.drugid === row.drugid)
                            ?
                            <>
                                <TextField
                                name="discount" 
                                {...formik.getFieldProps('discount')}
                                onChange={(event)=>{handleChangeDecimalField(event)}}
                                onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                                className='field-inside-cell' />
                                
                                {(formik.touched.discount && Boolean(formik.errors.discount)) 
                                && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.discount}</div>}
                            </> 
                            : 
                            row.discount
                        }
                    </TableCell>
                    <TableCell  align="center">
                        {
                            (editMode && billItemData.drugid === row.drugid)
                            ? 
                            <>
                                <TextField
                                name="tax" 
                                {...formik.getFieldProps('tax')}
                                onChange={(event)=>{handleChangeDecimalField(event)}}
                                onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                                className='field-inside-cell' />

                                {(formik.touched.tax && Boolean(formik.errors.tax)) 
                                && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.tax}</div>}
                            </>
                            : 
                            row.tax
                        }
                    </TableCell>
                    <TableCell  style={{backgroundColor:'#fffbc5', textAlign:'center'}}>{row.pprice || 0}</TableCell>
                    <TableCell style={{backgroundColor:'#D4EEE3', textAlign:'center'}}>{Math.round((+row.pprice * +row.quantity)*1000)/1000}</TableCell>
                    </TableRow>

                ))}
                    <TableRow>
                        <TableCell colSpan={10} sx={{backgroundColor: '#f7f7f7', borderBottom:"2px solid #f7f7f7"}}></TableCell>
                        <TableCell style={{
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            backgroundColor:'#D4EEE3'}}>{props.actions.handeFetchBillTotal() || 0}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}