import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@mui/material';
import { useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { format, isValid, addYears } from 'date-fns';
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import  "@/api.config";

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


export default function PurchaseReturnBillItems(props) {
    
    function resetBillForm() {
        setEditMode(false);
        setRowToEdit({}); 
    }

    function addToDb(values) {
        props.actions.setOpenLoading(true);
        axios.post(`api/v1/purchases/returns/items`, values)
        .then((response)=>{
            props.actions.handleChangeOnRows(response.data.data); 
            props.actions.handleAssignReturnBillTotal(response.data.data.totalreturnbill);  
            resetBillForm();
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Item'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Item'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    }

    function updateToDb(values) {
        props.actions.setOpenLoading(true);
        axios.put(`api/v1/purchases/returns/items/${rowToEdit.id}`, values)
        .then((response)=>{
            props.actions.handleChangeOnRows(response.data.data);   
            props.actions.handleAssignReturnBillTotal(response.data.data.totalreturnbill); 
            resetBillForm();  
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Item'
            });
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Item'
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
            axios.delete(`api/v1/purchases/returns/items/${itemInfo.id}`)
            .then((response)=>{
                props.actions.handleDeleteItemFromBill(itemInfo);   
                props.actions.handleAssignReturnBillTotal(response.data.data.totalreturnbill);
                resetBillForm();  
                props.actions.setAlertObj({
                    open: true,
                    type: 'success',
                    message: 'Successfully Delete Item'
                });
            })
            .catch(()=>{
                props.actions.setAlertObj({
                    open: true,
                    type: 'error',
                    message: 'Failed Delete Item'
                });
            })
            .finally(()=>{
                props.actions.setOpenLoading(false);
            });
        }
        else {
            props.actions.handleDeleteItemFromBill(itemInfo);  
            props.actions.setOpenLoading(false);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Item'
            });
        }
    }

    function checkActionIsUpdate(rowData){
        if(rowData.id) return true;
        else return false;
    }
    
    const[rowToEdit, setRowToEdit] = useState({});
    const formik = useFormik({
        initialValues: {
            quantity: '',
            price: '',
        },
        enableReinitialize: true,
        validateOnChange: true,

        validationSchema: Yup.object({
            quantity: Yup.number()
            .typeError("Required")
            .required('Required')
            .integer('Only Int')
            .min(1, "num >= 1")
            .max((rowToEdit.inventoryqty || Number.MAX_VALUE), "Num <= " + (rowToEdit.inventoryqty || Number.MAX_VALUE)),

            price: Yup.number()
            .typeError("Required")
            .required('Required')
            .min(0, "num >= 0"),
        }),
        onSubmit: (values)=>{
            values.purchasereturnbill_id = props.purchaseReturnBillId;
            values.purchaseitem_id = rowToEdit.purchaseitemid;
            const isActionToUpdate = checkActionIsUpdate(rowToEdit);
            if(isActionToUpdate) {
                updateToDb(values);
            }
            else {
                addToDb(values);
            }
        }
    });
    const[editMode, setEditMode] = useState(false);
    
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

    return(
        <Table style={{backgroundColor: 'white'}} className="bill-style">
            <TableHead>
                <TableRow>
                    <TableCell style={{fontWeight:"bold", width:'30px'}}></TableCell>
                    <TableCell style={{fontWeight:"bold", width:'30px'}}>#</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '150px'}} align="left">Drug Name</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#fffbc5', width: '50px'}} align="center">Quantity</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#fffbc5', width: '50px'}} width={3} align="center">Price</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Inventory QTY</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '100px'}} align="center">Ex-Date</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Discount(%)</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Tax(%)</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">P-Price</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#D4EEE3', width: '100px'}} align="center">Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {props.rows && props.rows.map((row, index) => (
                <TableRow
                key={row.drugid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onDoubleClick={()=>{
                    if(rowToEdit == null || row.drugid !== rowToEdit.drugid) {
                        setEditMode(true);
                        setRowToEdit(row);
                        formik.resetForm();
                        formik.setFieldValue('quantity', row.quantity);
                        formik.setFieldValue('price', row.price);
                    }       
                }}
                >
                <TableCell>
                    <DeleteForeverIcon onClick={()=>{deleteItemFromBill(row)}} color="error" fontSize="small" sx={{cursor:'pointer'}}/>
                </TableCell>
                <TableCell component="th" scope="row">
                    {index+1}
                </TableCell>
                <TableCell  align="left">{row.name}</TableCell>
                <TableCell  style={{backgroundColor:'#fffbc5'}}  align="center">
                    {
                        (editMode && rowToEdit.drugid === row.drugid)
                        ? 
                        <>
                            <TextField 
                            name="quantity" 
                            {...formik.getFieldProps('quantity')}
                            onChange={(event)=>{handleChangeIntegerField(event)}}
                            onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                            className='field-inside-cell' />

                            {(formik.touched.quantity && Boolean(formik.errors.quantity)) 
                            && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.quantity}</div>}
                        </>
                        : 
                        row.quantity
                    }
                </TableCell>
                <TableCell style={{backgroundColor:'#fffbc5'}} align="center">
                    {
                        (editMode && rowToEdit.drugid === row.drugid)
                        ? 
                        <>
                            <TextField 
                            name="price" 
                            {...formik.getFieldProps('price')}
                            onChange={(event)=>{handleChangeDecimalField(event)}}
                            onKeyUp={(event)=>{handleEditDataItemOnBill(event)}}
                            className='field-inside-cell' />

                            {(formik.touched.price && Boolean(formik.errors.price)) 
                            && <div style={{color: "red", fontSize: "12px"}}>{formik.errors.price}</div>}
                        </>
                        : 
                        row.price
                    }
                </TableCell>
                <TableCell  align="center">
                    { 
                        row.inventoryqty
                    }
                </TableCell>
                <TableCell  align="center">
                    { 
                        (row.exdate) ? format(new Date(row.exdate), 'MM/yy') : '-'
                    }
                </TableCell>
            
                <TableCell  style={{textAlign:'center'}}>
                    {
                        row.discount
                    }
                </TableCell>
                <TableCell  align="center">
                    {
                        row.tax
                    }
                </TableCell>
                <TableCell  style={{textAlign:'center'}}>{row.pprice || 0}</TableCell>
                <TableCell style={{backgroundColor:'#D4EEE3', textAlign:'center'}}>{+row.price * +row.quantity}</TableCell>
                </TableRow>

            ))}
                <TableRow>
                    <TableCell colSpan={10} sx={{backgroundColor: '#f3f3f3', borderBottom:"2px solid #f3f3f3"}}></TableCell>
                    <TableCell style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor:'#D4EEE3'}}>{props.actions.handeFetchReturnBillTotal() || 0}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}