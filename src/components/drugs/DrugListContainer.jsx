import React, { useEffect, useState } from "react";
import DrugList from "./DrugList";
import axios from "axios";
import "@/api.config";
import { Container } from "@mui/material";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';

export default function DrugListContainer() {   

    const [openLoading, setOpenLoading] = React.useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [drugs, setDrugs] = useState([]);
    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);

    const handleOpenLoading = () => {
        setOpenLoading(true);
    };

    const handleCloseAlert = (event, reason) => {
        
        if (reason === 'clickaway') return;

        setAlertObj({
            type: '',
            message: '',
            open: false
        });
    };

    function fetchDrugs(page, range) {
        axios.get(`api/v1/drugs?page=${page}&range=${range}`)
        .then((response)=>{
            setDrugs(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Fetch Drugs'
            });
        });
    }

    function editDrug(id) {
        // dispatch({ 
        //     type: 'sidenav/drug-add-edit'
        // });

        // dispatch({
        //     type: 'drug/store-edit-drug-id',
        //     payload: {drugId: id, tabIndex: 0, mode: 'edit'}
        // });
    }

    function deleteDrug(id) {

        setOpenLoading(true);

        axios.delete(`api/v1/drugs/${id}`)
        .then(()=>{
            fetchDrugs(page, range);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Drug'
            });
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Drug'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    function handlePagination(page) {
        setPage(page);
    }

    function handlePaginationRangeChange(range){

        setOpenLoading(true);

        axios.get(`api/v1/drugs?page=1&range=${range}`)
        .then((response)=>{
            setRange(range);
            setPage(1);
            setDrugs(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Fetch Drugs'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    useEffect(()=>{ 
        fetchDrugs(page, range);
    }, [page]);

    return(
        <>
        <MainHeader title={"List All Drugs"}></MainHeader>
            <Container>
               <DrugList 
                actions={{
                   editDrug, 
                   deleteDrug, 
                   handlePagination, 
                   handlePaginationRangeChange, 
                   handleOpenLoading}} 
                data={drugs} />   
            </Container>

            <Loading open={openLoading} />

            <AlertInfo
                alertObj={alertObj}
                actions={{ handleCloseAlert }} 
            />
        </>
    );
}