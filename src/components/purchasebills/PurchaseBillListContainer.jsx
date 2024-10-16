import React, { useEffect, useState } from "react";
import axios from "axios";
import "@/api.config";
import { Container } from "@mui/material";
import PurchaseBillList from "./PurchaseBillList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from "@/common/MainHeader";

export default function PurchaseBillListContainer() {


    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [purchaseBills, setPurchaseBills] = useState([]);

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

    function viewPurchaseBill(id) {
        // dispatch({
        //     type: 'sidenav/purchase-bill-view'
        // });
        // dispatch({
        //     type: 'purchaseBill/store-view-purchase-bill-id',
        //     payload: {
        //         purchaseBillId: id, 
        //         tabIndex: 0
        //     }
        // });
    }

    function editPurchaseBill(id) {
        // dispatch({
        //     type: 'sidenav/purchase-bill-add-edit'
        // });
        // dispatch({
        //     type: 'purchaseBill/store-edit-purchase-bill-id',
        //     payload: {
        //         purchaseBillId: id, 
        //         tabIndex: 0
        //     }
        // });
    }

    function deletePurchaseBill(id) {

        setOpenLoading(true);

        axios.delete(`api/v1/purchases/${id}`)
        .then(()=>{
            fetchPurchaseBill(page, range);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Purchase Bill'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Purchase Bill'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    function fetchPurchaseBill(page, range) {
        axios.get(`api/v1/purchases?page=${page}&range=${range}&
        fields=id,supplier,billnumber,issuedate,paymenttype,paidstatus,billstatus,total`)
        .then((response)=>{
            setPurchaseBills(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    function handlePagination(page) {
        setOpenLoading(true);
        setPage(page);
    }

    function handlePaginationRangeChange(range){ 
        setOpenLoading(true);
        setRange(range);
        setPage(1);
    }

    useEffect(()=>{ 
        fetchPurchaseBill(page, range);
    }, [page, range]);

    return(
        <>
            <MainHeader title={"List All Purchase Bills"}></MainHeader>
            <Container>
               <PurchaseBillList actions={{
                   editPurchaseBill, 
                   deletePurchaseBill, 
                   viewPurchaseBill, 
                   handlePagination, 
                   handlePaginationRangeChange}} 
                   data={purchaseBills} />   
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