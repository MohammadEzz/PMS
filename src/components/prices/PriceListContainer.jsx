import { useState, useEffect } from "react";
import { Box } from '@mui/system';
import { Chip, Container, Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import TabPanel from '../../common/TabPanel';
import {TextField} from "@mui/material";
import axios from "axios";
import '@/api.config';
import PriceList from "./PriceList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';

export default function PriceListContainer () {

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    
    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });

    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [price, setPrice] = useState([]);
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

    function fetchPrice(page, range) {
        axios.get(`api/v1/prices?page=${page}&range=${range}`)
        .then((response)=>{
            setPrice(response.data.data);
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
        fetchPrice(page, range);
    }, [page, range]);

    return (
        <>
            <MainHeader title={"List All Prices"}></MainHeader>

            <Container>
                <PriceList actions={{handlePagination, handlePaginationRangeChange}} data={price}/>
            </Container>

            <Loading
            open={openLoading}
            />

            <AlertInfo 
            alertObj={alertObj}
            actions={{handleCloseAlert}}/>  
        </>
    )
}