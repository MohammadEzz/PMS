import { useEffect, useState } from "react";
import axios from "axios";
import "@/api.config";
import { Container, Fade } from "@mui/material";
import PurchaseReturnBillItemsView from "./PurchaseReturnBillItemsView";
import PurchaseBillInfoView from "./PurchaseBillInfoView";
import PurchaseReturnBillActionHeader from "./PurchaseReturnBillActionHeader";
import TitleSectionWithStatus from "./TitleSectionWithStatus";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';
import { useParams } from "react-router-dom";

export default function PurchaseReturnBillViewContainer (props) {

    let {purchaseReturnBillId} = useParams();
    let {purchaseBillId} = useParams();
    let mode = 'add';

    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [rows, setRows] = useState([]);
    const [savedItem, setSavedItem] = useState(null);
    const [returnBillTotal, setReturnBillTotal] = useState(null);
    const [approvedStatus, setApprovedStatus] = useState(false);
    const [invalidQuantity, setInvalidQuantity] = useState([]);
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

    function formatListOfPurchaseReturnBillItems(items) {
        const newRows = [];
        for(let item in items) {
            newRows[item]= {
                id : items[item].id,
                purchaseitemid: items[item].purchaseitem_id,
                drugid : items[item].drug_id,
                barcode: items[item].barcode,
                name : items[item].name,
                quantity : items[item].quantity,
                price : items[item].price,
                inventoryqty : items[item].inventoryqty,
                exdate : items[item].expiredate,
                pprice : Math.round(items[item].purchaseprice*100)/100,
                discount : items[item].discount,
                tax : items[item].tax,
            }
        }
        setRows(newRows);
    }

    function fetchPurchaseBill(purchaseBillId) {
        axios.get(`api/v1/purchases/${purchaseBillId}`)
        .then((response)=>{
            setSavedItem(response.data.data);
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

    function fetchPurchaseReturnBill(purchaseReturnBillId) {
        axios.get(`api/v1/purchases/returns/${purchaseReturnBillId}`)
        .then((response)=>{
            setReturnBillTotal(response.data.data.total);
            setApprovedStatus(response.data.data.billstatus === 'approved')
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

    function fetchPurchaseReturnItems() {
        axios.get(`api/v1/purchases/returns/items?range=all&filter=purchasereturnbill_id:eq[${purchaseReturnBillId}]`)
        .then((response)=>{
            setRows([]);
            formatListOfPurchaseReturnBillItems(response.data.data);
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
    
    function handeFetchReturnBillTotal() {
        return returnBillTotal;
    }

    function checkInvalidQuantity(rows) {
        let invalid = [];
        for(let index in rows) {
            if(rows[index].inventoryqty < rows[index].quantity) {
                invalid.push(rows[index].id);
            }
        }
        return invalid;
    }

    function approveReturnBill() {

        setOpenLoading(true);

        const invalidQty = checkInvalidQuantity(rows);
        setInvalidQuantity(invalidQty); 

        if(invalidQty.length !== 0) {
            setAlertObj({
                open: true,
                type: 'warning',
                message: 'Inventory Quantaty Changed'
            });
            setOpenLoading(false);
            return;
        }

        axios.post(`api/v1/purchases/returns/${purchaseReturnBillId}/approve`)
        .then(()=>{
            setApprovedStatus(true);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Approve Purchase Return Bill'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Approve Purchase Return Bill'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });

    }

    useEffect(()=>{
        // if(mode === 'view') {
            fetchPurchaseBill(purchaseBillId);
            fetchPurchaseReturnBill(purchaseReturnBillId);
            fetchPurchaseReturnItems(purchaseReturnBillId);
    }, [purchaseReturnBillId]);

    useEffect(()=>{
        if(savedItem && rows && returnBillTotal) {
            setReadyToShow(true);
        }
    }, [savedItem, rows, returnBillTotal]);

    return (
        <>
            <MainHeader title={"View Purchase Return Bill Information"}></MainHeader>
            <Container>
                {
                    (savedItem && readyToShow)
                    &&
                    <Fade
                    in={true}
                    easing='linear'
                    timeout={200}> 
                        <div>
                        <h2>General Info</h2>
                        <PurchaseBillInfoView savedItem={savedItem} />
                        
                        <div className="info-block">
                            {
                                !approvedStatus
                                &&
                                <PurchaseReturnBillActionHeader 
                                link={`/purchases/${purchaseBillId}/returns/${purchaseReturnBillId}/edit`}
                                actions={{approveReturnBill}} />
                            }

                            <TitleSectionWithStatus id={purchaseReturnBillId} status={approvedStatus}/>
                            <PurchaseReturnBillItemsView actions={{handeFetchReturnBillTotal}} rows={rows} invalidQuantity={invalidQuantity}/>
                        </div>
                    </div>
                </Fade>
                }
            </Container>

            <Loading
            open={openLoading}
            />

            <AlertInfo 
            alertObj={alertObj}
            actions={{handleCloseAlert}}/> 
        </>
    );
}
