import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "@/api.config";
import DiseaseList from "./DiseaseList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from "@/common/MainHeader";

export default function DiseaseListContainer() {

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

    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [diseaseList, setDiseaseList] = useState([]);

    function editDisease(id) {
        // dispatch({
        //     type: 'sidenav/disease-add-edit'
        // });
        // dispatch({
        //     type: 'disease/store-edit-disease-id',
        //     payload: {diseaseId: id, tabIndex: 0, mode: 'edit'}
        // });
    }

    function fetchDiseases(page, range) {
        axios.get(`api/v1/diseases?page=${page}&range=${range}&sort=id.desc`)
        .then((response)=>{
            setRange(range);
            setPage(page);
            setDiseaseList(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Fetch Diseases'
            });
        });
    }

    function deleteDisease(id) {
        setOpenLoading(true);
        axios.delete(`api/v1/diseases/${id}`)
        .then(()=>{
            const items = diseaseList.data.filter((disease) => (+(disease.id) !== +id));
            fetchDiseases(page, range);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Disease'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Disease'
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
        fetchDiseases(1, range)
    }

    useEffect(()=>{
        fetchDiseases(page, range);
    }, [page]);

    return(
        <>
        <MainHeader title={"List All Diseases"}></MainHeader>

        <Container>
            <DiseaseList actions={{deleteDisease, editDisease, handlePagination, handlePaginationRangeChange}} data={diseaseList} />
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