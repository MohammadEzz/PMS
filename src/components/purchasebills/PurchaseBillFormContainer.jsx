import { useState, useEffect } from "react";
import { Box } from '@mui/system';
import { Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@/common/TabPanel';
import {Fade} from "@mui/material";
import PurchaseBillForm from "./PurchaseBillForm";
import axios from "axios";
import '@/api.config';
import PurchaseBillItems from "./PurchaseBillItems";
import PurchaseBillSearchBlock from "./PurchaseBillSearchBlock";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from "@/common/MainHeader";
import { useParams } from "react-router-dom";

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
export default function PurchaseBillFormContainer() {

    const {purchaseBillId} = useParams();

    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [tabIndex, setTabIndex] = useState(0);
    const [dealerOptions, setDealerOptions] = useState(null);
    const [supplierOptions, setSupplierOptions] = useState(null);
    const [billTotal, setBillTotal] = useState(null);
    const [rows, setRows] = useState(null);
    const [savedItem, setSavedItem] = useState(null);
    const [readyToShow, setReadyToShow] = useState(false);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setAlertObj({
            type:'',
            message: '',
            open: false
        });
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    function handleAssignSavedItem(values) {
        setSavedItem(values);
    }

    function fetchSupplierOptions() {
        axios.get('api/v1/suppliers?range=all')
        .then((response)=>{
            setSupplierOptions(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    function fetchDealerRelatedToSupplierOptions(supplierId) {
        axios.get(`api/v1/dealers?range=all&filter=supplier:eq[${supplierId}]`)
        .then((response)=>{
            setDealerOptions(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }
    
    function checkIfDurgIsExistInBill(attribute, value, listOfDrugs) {
        let searchResult = 
        (listOfDrugs)
        ? listOfDrugs.find((item)=>{
            return +(item[attribute]) === +value;
        })
        : undefined;
        return searchResult;
    }

    function handeFetchBillTotal() {
        return billTotal;
    }
    
    function handleAssignBillTotal(value) {
        setBillTotal(value);
    }

    function handleChangeOnRows(data) {
        for(let row in rows) {
            if(rows[row].drugid === data.drug_id) {
                rows[row]= {
                    id : data.id,
                    drugid : data.drug_id,
                    barcode: data.drugbarcode,
                    name : data.name,
                    quantity : data.quantity,
                    bonus : data.bonus,
                    exdate : data.expiredate,
                    sprice : data.sellprice,
                    pprice : data.purchaseprice,
                    discount : data.discount,
                    tax : data.tax,
                }
                setRows([...rows]);
                break;
            }
        }
    }

    function addItemToRow(drugInfo) {
        let formatDrugInfo = {
          drugid : drugInfo.id,
          barcode: drugInfo.barcode,
          name : drugInfo.name,
          quantity: 0,
          bonus: 0,
          exdate: '',
          sprice: 0,
          pprice: 0,
          discount: 0,
          tax: 0
        }
        setRows([...(rows || []), formatDrugInfo]);
    }

    function formatListOfPurchaseBillItems(items) {
        const newRows = [];
        for(let item in items) {
            newRows[item]= {
                id : items[item].id,
                drugid : items[item].drug_id,
                barcode: items[item].drugbarcode,
                name : items[item].name,
                quantity : items[item].quantity,
                bonus : items[item].bonus,
                exdate : items[item].expiredate,
                sprice : Math.round(items[item].sellprice*100)/100,
                pprice : Math.round(items[item].purchaseprice*100)/100,
                discount : items[item].discount,
                tax : items[item].tax,
            }
        }
        setRows(newRows);
    }

    function generateNewRowsAfterDelete(rows, itemToDelete) {
        const newRows = rows.filter((item)=> item.drugid !== itemToDelete.drugid);
        return newRows;
    }

    function handleDeleteItemFromBill(itemInfo) {
        let newRows = generateNewRowsAfterDelete(rows, itemInfo);
        setRows(newRows);
    }

    function fetchDrugByBarCode(barCode) {

        setOpenLoading(true);

        const isDrugExistInBill = checkIfDurgIsExistInBill('barcode', barCode, rows);
        if(isDrugExistInBill !== undefined) {
        setAlertObj({
            open: true,
            type: 'warning',
            message: 'Drug Already Exist In Bill'
        });
        setOpenLoading(false);
        return;
        }
        axios.get(`api/v1/drugs?range=all&filter=barcode:eq[${barCode}]&fields=id,barcode,name,type,middleunitnum,smallunitnum`)
        .then((response)=>{
            addItemToRow( response.data.data[0]);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Read Item'
            });
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Read Item'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }  
    
    function fetchDrugById(id) {

        setOpenLoading(true);

        const isDrugExistInBill = checkIfDurgIsExistInBill('drugid', id, rows);
        if(isDrugExistInBill !== undefined) {
            setAlertObj({
                open: true,
                type: 'warning',
                message: 'Drug Already Exist In Bill'
            });
            setOpenLoading(false);
            return;
        }
        
        axios.get(`api/v1/drugs?range=all&filter=id:eq[${id}]&fields=id,barcode,name,type,middleunitnum,smallunitnum`)
        .then((response)=>{
            addItemToRow( response.data.data[0]);
            setAlertObj({
            open: true,
            type: 'success',
            message: 'Successfully Read Item'
            });
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Read Item'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    } 

    function fetchPurchaseBill(id) {
        axios.get(`api/v1/purchases/${id}`)
        .then((response)=>{
            setSavedItem(response.data.data);
            setBillTotal((Math.round(response.data.data.total*100))/100);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    function fetchPurchaseBillItem(id) {
        axios.get(`api/v1/purchases/items?range=all&filter=purchasebill_id:eq[${id}]`)
        .then((response)=>{
            formatListOfPurchaseBillItems(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    useEffect(()=>{
        if(supplierOptions === null) {
            fetchSupplierOptions();
        }

        if(purchaseBillId && savedItem === null && rows === null) {
            fetchPurchaseBill(purchaseBillId);
            fetchPurchaseBillItem(purchaseBillId);
        }
        else {
            setTabIndex(0);
            setSavedItem(null);
            setRows(null);
        }
    }, [purchaseBillId]);

    useEffect(()=>{
        if(savedItem) {
            fetchDealerRelatedToSupplierOptions(savedItem.supplier_id);
        }
    }, [savedItem]);

    useEffect(()=>{
        if(purchaseBillId && savedItem && (billTotal || billTotal === 0) && rows && supplierOptions && dealerOptions) {
            setReadyToShow(true);
        }
        else if(supplierOptions) {
            setReadyToShow(true);
        }
    }, [savedItem, billTotal, rows, supplierOptions, dealerOptions, purchaseBillId]);

    return (
        <>
            <MainHeader title={
            purchaseBillId
            ? "Edit Purchase Bill"
            : "Add New Purchase Bill"}></MainHeader>
            <Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Purchase Bill Froms">
                    <Tab size={"small"} label="Bill Info" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                {
                    (readyToShow)
                    &&
                    <Fade 
                    in={true}
                    easing='linear'
                    timeout={150}> 
                        <div>
                            <PurchaseBillForm 
                                actions={{
                                    handleTabChange, 
                                    handleAssignSavedItem, 
                                    fetchDealerRelatedToSupplierOptions,
                                    setAlertObj,
                                    setOpenLoading}} 
                                supplierOptions= {supplierOptions}
                                dealerOptions={dealerOptions}
                                setDealerOptions = {setDealerOptions}
                                savedItem={savedItem}
                                purchaseBillId={purchaseBillId}/>

                                {
                                    
                                (savedItem)
                                &&
                                <>
                                    <PurchaseBillSearchBlock actions={{fetchDrugById, fetchDrugByBarCode}}/>
                                    <PurchaseBillItems 
                                    actions={{
                                        handleDeleteItemFromBill, 
                                        handleChangeOnRows, 
                                        handeFetchBillTotal, 
                                        handleAssignBillTotal,
                                        setAlertObj,
                                        setOpenLoading
                                    }} 
                                    purchaseBillId={purchaseBillId || savedItem.id}
                                    rows={rows}/>
                                </>
                                }  
                        </div>
                    </Fade>
                }
            </TabPanel>

            <Loading
            open={openLoading}
            />
            
            <AlertInfo 
            alertObj={alertObj}
            actions={{handleCloseAlert}}/>
        </>
    );
}