import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "@/api.config";
import ActiveIngredientList from "./ActiveIngredientList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';

export default function ActiveIngredientListContainer() {

    
    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });

    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [activeIngredientList, setActiveIngredientList] = useState([]);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setAlertObj({
            type:'',
            message: '',
            open: false});
    };

    function fetchActiveIngredient(page, range) {
        axios.get(`api/v1/activeingredients?page=${page}&range=${range}&sort=id.asc`)
        .then((response)=>{
            setActiveIngredientList(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Fetch Active Ingredients'
            });
        });
    }

    function editActiveIngredient(id) {
        // dispatch({
        //     type: 'activeIngredient/store-edit-active-ingredient-id',
        //     payload: {activeIngredientId: id, tabIndex: 0}
        // });
        
        // dispatch({
        //     type: 'sidenav/active-ingredient-add-edit',
        //     payload: {navState: "active-ingredient-add-edit"}
        // });
    }

    function deleteActiveIngredient(id) {
        setOpenLoading(true);
        axios.delete(`api/v1/activeingredients/${id}?page=${page}&range=${range}`)
        .then(()=>{
            fetchActiveIngredient(page, range);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Active Ingredients'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Active Ingredients'
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
        axios.get(`api/v1/activeingredients?page=1&range=${range}`)
        .then((response)=>{
            setOpenLoading(true);
            setRange(range);
            setPage(1);
            setActiveIngredientList(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Fetch Active Ingredients'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    useEffect(()=>{
        fetchActiveIngredient(page, range);
    }, [page]);
    
    return(
        <>
        <MainHeader title={"List All Active Ingredient"}></MainHeader>
        <Container>
            <ActiveIngredientList actions={
                {
                    deleteActiveIngredient, 
                    editActiveIngredient, 
                    handlePagination, 
                    handlePaginationRangeChange
                    }
                } data={activeIngredientList} />
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