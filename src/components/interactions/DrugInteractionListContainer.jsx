import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "@/api.config";
import DrugInteractionList from "./DrugInteractionList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';

export default function DrugIntractionListContainer() {

    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [drugInteractionList, setDrugInteractionList] = useState([]);

    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });

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

    function fetchDrugInteraction(page, range) {
        axios.get(`api/v1/druginteractions?page=${page}&range=${range}`)
        .then((response)=>{
            setRange(range);
            setPage(page);
            setDrugInteractionList(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            })
        });
    }

    function editDrugIntraction(id) {
       
    }

    function deleteDrugIntraction(id) {

        setOpenLoading(true);

        axios.delete(`api/v1/druginteractions/${id}?page=${page}&range=${range}`)
        .then(()=>{
            fetchDrugInteraction(page, range);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Drug Interaction'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Drug Interaction'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    function handlePaginationRangeChange(range){
        fetchDrugInteraction(1, range);
    }

    function handlePagination(page) {
        setPage(page);
    }

    useEffect(()=>{
        fetchDrugInteraction(page, range);
    }, [page]);

    return(
        <>
            <MainHeader title={"List All Drug Interaction"}></MainHeader>
            <Container>
                <DrugInteractionList actions={{
                    deleteDrugIntraction, 
                    editDrugIntraction, 
                    handlePagination, 
                    handlePaginationRangeChange}} 
                    data={drugInteractionList} />
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