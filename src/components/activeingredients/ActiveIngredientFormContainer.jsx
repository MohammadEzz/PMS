import { useState, useEffect } from "react";
import { Box } from '@mui/system';
import { Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@/common/TabPanel';
import axios from "axios";
import '@/api.config';
import ActiveIngredientForm from "./ActiveIngredientForm";
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

export default function ActiveIngredientFormContainer() {

  
    const {activeIngredientId} = useParams();

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
            type: '',
            message: '',
            open: false
        });
    };

    const [tabIndex, setTabIndex] = useState(0);
    const [savedItem, setSavedItem] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    function handleAssignSavedItem(values) {
        setSavedItem(values);
    }

    // Fetch Acitve Ingredient Info On Edit Process
    function fetchActiveIngredient(activeIngredientId) {
        axios.get(`api/v1/activeingredients/${activeIngredientId}`)
        .then((response)=>{
            setSavedItem(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: "Failed Fetch Active Ingredient"
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    useEffect(()=>{
        if(activeIngredientId) {
            setOpenLoading(true);
            fetchActiveIngredient(activeIngredientId);
        }
        else setSavedItem(null);
    }, [activeIngredientId]);

    return (
        <>
            <MainHeader title={
                activeIngredientId
                ? "Edit Active Ingredient"
                : "Add New Active Ingredient"}></MainHeader>
            <Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="ActiveIngredient Froms">
                    <Tab size={"small"} label="General Info" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <ActiveIngredientForm actions={{
                    handleTabChange, 
                    handleAssignSavedItem,
                    setOpenLoading,
                    setAlertObj
                }} 
                    activeIngredientId={activeIngredientId}
                    savedItem={savedItem} />
            </TabPanel>

            <Loading
            open={openLoading}
            />

            <AlertInfo
            alertObj={alertObj}
            actions={{ handleCloseAlert }} 
            />
        </>
    );
}