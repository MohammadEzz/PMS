import { useState, useEffect } from "react";
import { Box } from '@mui/system';
import { Fade, Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@/common/TabPanel';
import axios from "axios";
import '@/api.config';
import PurchaseBillInfoView from "./PurchaseBillInfoView";
import PurchaseReturnBillItems from "./PurchaseReturnBillItems";
import PurchaseReturnBillSearchBlock from "./PurchaseReturnBillSearchBlock";
import TitleSectionWithoutStatus from "./TitleSectionWithoutStatus";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';
import { useParams } from "react-router-dom";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  
export default function PurchaseReturnBillFormContainer() {

    const {purchaseBillId} = useParams();
    const {purchaseReturnBillId} = useParams();

    const [openLoading, setOpenLoading] = useState(true);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [tabIndex, setTabIndex] = useState(0);
    const [savedItem, setSavedItem] = useState(null);
    const [rows, setRows] = useState(null);
    const [drugOptions, setDrugOptions] = useState(null);
    const [returnBillTotal, setReturnBillTotal] = useState(null);
    const [readyToShow, setReadyToShow] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

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

    function formatListOfPurchaseReturnBillItems(items) {
        const newRows = [];
        for(let item in items) {
            newRows[item]= {
                id : items[item].id,
                purchaseitemid: items[item].purchaseitem_id,
                drugid : items[item].drug_id,
                barcode: items[item].barcode,
                name : items[item].name,
                quantity : Math.round(items[item].quantity*100)/100,
                price : Math.round(items[item].price*100)/100,
                inventoryqty : items[item].inventoryqty,
                exdate : items[item].expiredate,
                discount : Math.round(items[item].discount*100)/100,
                tax : Math.round(items[item].tax*100)/100,
                pprice : Math.round(items[item].purchaseprice*100)/100,
            }
        }
        setRows(newRows);
    }

    function handeFetchReturnBillTotal() {
        return returnBillTotal;
    }
    function handleAssignReturnBillTotal(value) {
        setReturnBillTotal(value);
    }

    function checkIfDurgIsExistInReturnBill(attribute, value, listOfDrugs) {
        let searchResult = (listOfDrugs)
        ? listOfDrugs.find((item)=>{
            return +(item[attribute]) === +value;
        })
        : undefined;
        return searchResult;
    }

    function handleChangeOnRows(data) {
        for(let row in rows) {
            if(rows[row].purchaseitemid === data.purchaseitem_id) {
                rows[row]= {
                    ...rows[row],
                    id : data.id,
                    quantity : data.quantity,
                    price : data.price,
                }
                setRows([...rows]);
                break;
            }
        }
    }

    function addItemToRow(inventoryInfo) {
        let formatDrugInfo = {
          inventoryid : inventoryInfo.id,
          purchaseitemid: inventoryInfo.purchaseitem_id,
          drugid : inventoryInfo.drug_id,
          barcode: inventoryInfo.barcode,
          name : inventoryInfo.name,
          quantity: 0,
          price: 0,
          inventoryqty: inventoryInfo.quantity,
          exdate: inventoryInfo.expiredate,
          discount: Math.round(inventoryInfo.discount*100)/100,
          tax: Math.round(inventoryInfo.tax*100)/100,
          pprice: Math.round(inventoryInfo.purchaseprice*100)/100,
        }
        setRows([...(rows || []), formatDrugInfo]);
    }

    function generateNewRowsAfterDelete(rows, itemToDelete) {
        const newRows = rows.filter((item)=> item.purchaseitemid !== itemToDelete.purchaseitemid);
        return newRows;
    }

    function handleDeleteItemFromBill(itemInfo) {
        let newRows = generateNewRowsAfterDelete(rows, itemInfo);
        setRows(newRows);
    }

    function fetchDrugByBarCode(barCode) {
        setOpenLoading(true);
        const selectedDrug = drugOptions.find((item)=> +(item.barcode) === +barCode);
        if(selectedDrug === undefined) {
            setAlertObj({
                open: true,
                type: 'warning',
                message: 'Drug Not Exist in Purchase Bill'
            });
            setOpenLoading(false);
            return;
        }
        
        const isDrugExistReturnInBill = checkIfDurgIsExistInReturnBill('barcode', barCode, rows);
        if(isDrugExistReturnInBill !== undefined) {
            setAlertObj({
                open: true,
                type: 'warning',
                message: 'Drug Alreay Exist'
            });
            setOpenLoading(false);
            return;
        }

        axios.get(`api/v1/inventory?range=all&filter=purchaseitem_id:eq[${selectedDrug.id}]`)
        .then((response)=>{
          addItemToRow(response.data.data[0]);
          setAlertObj({
            open: true,
            type: 'success',
            message: 'Successfully Read Drug'
            });
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Read Drug'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }  
      
    function fetchDrugById(id) {

        setOpenLoading(true);

        const selectedDrug = drugOptions.find((item)=>item.drug_id === id);
        if(selectedDrug === undefined) {
            setAlertObj({
                open: true,
                type: 'warning',
                message: 'Drug Not Exist in Purchase Bill'
            });
            setOpenLoading(false);
            return;
        }  
        
        const isDrugExistReturnInBill = checkIfDurgIsExistInReturnBill('drugid', id, rows);
        if(isDrugExistReturnInBill !== undefined) {
            setAlertObj({
                open: true,
                type: 'warning',
                message: 'Drug Alreay Exist'
            });
            setOpenLoading(false);
            return;
        }
          
          axios.get(`api/v1/inventory?range=all&filter=purchaseitem_id:eq[${selectedDrug.id}]`)
          .then((response)=>{
            addItemToRow( response.data.data[0]);
                setAlertObj({
                    open: true,
                    type: 'success',
                    message: 'Successfully Read Drug'
                });
                setOpenLoading(false);
            })
            .catch(()=>{
                    setAlertObj({
                        open: true,
                        type: 'error',
                        message: 'Failed Read Drug'
                    });
                    setOpenLoading(false);
            })
            .finally(()=>{
                setOpenLoading(false);
            });
    } 

    function fetchPurchaseBill(id) {
        axios.get(`api/v1/purchases/${id}`)
        .then((response)=>{
            let purchaseBill = response.data.data
            setSavedItem(purchaseBill);
            fetchListOfDrugsInsidePurchaseBill(purchaseBill.id)
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

    function fetchPurchaseReturnBillTotal(id) {
        axios.get(`api/v1/purchases/returns/${id}`)
        .then((response)=>{
            const data = response.data.data;
            setReturnBillTotal(Math.round(data.total*100)/100);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    function fetchPurchaseReturnItems(id) {
        axios.get(`api/v1/purchases/returns/items?range=all&filter=purchasereturnbill_id:eq[${id}]`)
        .then((response)=>{
            setRows(null);
            const data = response.data.data;
            formatListOfPurchaseReturnBillItems(data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    function fetchListOfDrugsInsidePurchaseBill(id) {
        axios.get(`api/v1/purchases/items?range=all&filter=purchasebill_id:eq[${id}]&fields=id,drug_id,drugname,drugbarcode`)
        .then((response)=>{
            setDrugOptions(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    useEffect(()=>{
        if(purchaseBillId) {
            fetchPurchaseBill(purchaseBillId);
            fetchListOfDrugsInsidePurchaseBill(purchaseBillId);
        }
    }, [purchaseBillId]);

    useEffect(()=>{
        if(purchaseReturnBillId) {
            fetchPurchaseReturnItems(purchaseReturnBillId);
            fetchPurchaseReturnBillTotal(purchaseReturnBillId);
        }
        else {
            setRows(null);      
        }
    }, [purchaseReturnBillId]);

    useEffect(()=>{
        if(purchaseReturnBillId && savedItem && rows && drugOptions && (returnBillTotal || returnBillTotal === 0)) {
            setReadyToShow(true);
            setOpenLoading(false);
        }
        else if(savedItem && drugOptions) {
            setReadyToShow(true);
            setOpenLoading(false);
        }
    }, [purchaseReturnBillId, savedItem, rows, drugOptions, returnBillTotal]);

    return (
        <>
            <MainHeader title={
                purchaseReturnBillId
                ? "Edit Purchase Return Bill"
                : "Add New Pruchase Return Bill"
            }></MainHeader>
            <Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Purchase Bill">
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
                            <h2>General Info</h2>
                            <PurchaseBillInfoView savedItem={savedItem} />

                            <div className="info-block return-bill">
                                <TitleSectionWithoutStatus id={purchaseReturnBillId}/>

                                <PurchaseReturnBillSearchBlock drugOptions={drugOptions} actions={{fetchDrugById, fetchDrugByBarCode}}/>
                                <PurchaseReturnBillItems
                                purchaseReturnBillId={purchaseReturnBillId}
                                actions={{
                                handeFetchReturnBillTotal, 
                                handleAssignReturnBillTotal, 
                                handleChangeOnRows, 
                                handleDeleteItemFromBill,
                                setAlertObj,
                                setOpenLoading}} 
                                rows={rows}/>
                            </div>
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