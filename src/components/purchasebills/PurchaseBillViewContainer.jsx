import { useEffect, useState } from "react";
import PurchaseBillFormView from "./PurchaseBillFormView";
import PurchaseBillItemsView from "./PurchaseBillItemsView";
import axios from "axios";
import "@/api.config";
import { Button, Container, Fade } from "@mui/material";
import PurchaseBillActionHeader from "./PurchaseBillActionHeader";
import {format} from 'date-fns';
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from "@/common/MainHeader";
import { Link, useParams } from "react-router-dom";

export default function PurchaseBillViewContainer (props) {

    const {purchaseBillId} = useParams();
    const mode = 'add';
    
    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [rows, setRows] = useState(null);
    const [savedItem, setSavedItem] = useState(null);
    const [approvedStatus, setApprovedStatus] = useState(false);
    const [returnBills, setReturnBills] = useState([]);
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

    function editPurchaseBill() {
        // dispatch({
        //     type: 'sidenav/purchase-bill-add-edit'
        // });
        // dispatch({
        //     type: 'purchaseBill/store-edit-purchase-bill-id',
        //     payload: {
        //         purchaseBillId: savedItem.id, 
        //         tabIndex: 0
        //     }
        // });
    }

    function approvePurchaseBill() {
        setOpenLoading(true);
        axios.post(`api/v1/purchases/${purchaseBillId}/approve`)
        .then((response)=>{
            setApprovedStatus(true);
            setSavedItem({...savedItem, billstatus: 'approved'});
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Approved Purchase Bill'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Approved Purchase Bill'
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
            (response.data.data.billstatus === 'approved') && setApprovedStatus(true);
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

    function fetchPurchaseItems(id) {
        axios.get(`api/v1/purchases/items?range=all&filter=purchasebill_id:eq[${id}]`)
        .then((response)=>{
            formatListOfPurchaseBillItems(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        })
    }

    function fetchRelatedReturnBill(id) {
        axios.get(`api/v1/purchases/returns?range=all&filter=purchasebill_id:eq[${id}]`)
        .then((response)=>{
            setReturnBills(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        })
    }

    function createPurchaseReturnBill() {

        setOpenLoading(true);

        axios.post('api/v1/purchases/returns', {
            'purchasebill_id': savedItem.id,
            'issuedate': format(new Date(), 'yyyy-MM-dd')
        })
        .then((response)=>{
            setReturnBills([response.data.data, ...returnBills]);
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    useEffect(()=>{
        fetchPurchaseBill(purchaseBillId);
        fetchPurchaseItems(purchaseBillId);
        fetchRelatedReturnBill(purchaseBillId);
    }, []);

    useEffect(()=>{
        if(savedItem && rows && returnBills) {
            setReadyToShow(true);
        }
    }, [savedItem, rows, returnBills]);

    return (
        <>
            <MainHeader title={
                (mode === 'view')
                && "View Purchase Bill Information"
                }></MainHeader>
            <Container>
                {
                    (savedItem && readyToShow)
                    &&         
                    <Fade 
                    in={true}
                    easing='linear'
                    timeout={200}> 
                        <div>
                        {
                            !approvedStatus
                            &&
                            <PurchaseBillActionHeader purchaseBillId={purchaseBillId} actions={{approvePurchaseBill, editPurchaseBill}}/>
                        }
                        <PurchaseBillFormView setApprovedStatus={setApprovedStatus} savedItem={savedItem} />
                        <PurchaseBillItemsView total={savedItem.total} rows={rows} />
                        
                        {
                        approvedStatus
                        &&
                        <div>
                            <h2>Return Bills:</h2>
                            <div>
                            {
                                returnBills.map((item)=>{
                                    return (
                                    <div key={item.id}>
                                        <div className= {"return-bill-hint "+((item.billstatus === 'underreview') ? 'underreview' : 'approved')}>
                                            <span className="num">
                                                <Link to={`/purchases/${savedItem.id}/returns/${item.id}/edit`}>
                                                    #{item.id}
                                                </Link>
                                            </span>
                                            <span className="total">-{Math.round(item.total*100)/100} EGB</span>
                                            <span className="status">{(item.billstatus === 'underreview') ? 'Under Review' : 'Approved'}</span>
                                        </div>
                                    </div>
                                    );
                                })
                            }
                            </div>

                            <Button variant="contained" size="Large"  color="warning" onClick={ ()=>{ createPurchaseReturnBill() } }>
                                Create Return Bill
                            </Button>
                            </div> 
                        }
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
