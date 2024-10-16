import { useState, useEffect } from "react";
import { Container } from '@mui/material';
import axios from "axios";
import '@/api.config';
import DebitList from "./DebitList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';

export default function DebitListContainer () {
    
    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });

    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [debit, setDebit] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

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

    function fetchDebit(page, range) {
        axios.get(`api/v1/debits/supplier?page=${page}&range=${range}`)
        .then((response)=>{
            setDebit(response.data.data);
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
    
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    
    function handlePagination(page) {
        setOpenLoading(true);
        setPage(page);
    }

    function handlePaginationRangeChange(range){
        setOpenLoading(true);
        setPage(1);
        setRange(range);
    }

    useEffect(()=>{ 
        fetchDebit(page, range);
    }, [page, range]);

    return (
        <>
            <MainHeader title={"List All Debits"}></MainHeader>
            
            <Container>
                <DebitList actions={{handlePagination, handlePaginationRangeChange}} data={debit}/>
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