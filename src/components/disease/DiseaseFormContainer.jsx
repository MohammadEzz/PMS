import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Box } from '@mui/system';
import { Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import DiseaseForm from './DiseaseForm';
import TabPanel from '@/common/TabPanel';
import axios from "axios";
import '@/api.config';
import ActiveIngredientContainer from "./ActiveIngredientContainer";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from "@/common/MainHeader";

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function DiseaseFormContainer() {


    const {diseaseId} = useParams();
    const [openLoading, setOpenLoading] = useState(true);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });

    const [tabIndex, setTabIndex] = useState(0);
    const [savedItem, setSavedItem] = useState(null);
    const[diseaseCategoryOptions, setDiseaseCategoryOptions] = useState(null);
    
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

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
   
    function fetchDisease(diseaseId) {
        axios.get(`api/v1/diseases/${diseaseId}`)
        .then((response)=>{
            setSavedItem(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Read Disease'
            });
            setOpenLoading(false);
        });
    }

    function fetchDiseaseCategoyOptions() {
        axios.get('api/v1/options?range=all&fields=id,name&filter=type:eq[disease_category]&sort=name.asc')
        .then((response)=>{
            setDiseaseCategoryOptions(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Read Disease'
            });
            setOpenLoading(false);
        })
    }

    useEffect(()=>{
        if(diseaseCategoryOptions === null) {
            fetchDiseaseCategoyOptions();
        }

        if(diseaseId && savedItem === null) {
            fetchDisease(diseaseId);
        }
        else {
            setSavedItem(null);
            setTabIndex(0);
        }
        
    }, [diseaseId]);

    useEffect(()=>{
        if(diseaseId && diseaseCategoryOptions && savedItem){
            setOpenLoading(false);
        }
        else if(diseaseCategoryOptions) {
            setOpenLoading(false);
        }
    }, [diseaseCategoryOptions, savedItem]);

    return (
        <>
            <MainHeader title={
                diseaseId
                ? "Edit Disease"
                : "Add New Disease"}></MainHeader>
            <Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Disease Froms">
                    <Tab size={"small"} label="General Info" {...a11yProps(0)} />
                    <Tab disabled={!savedItem ? true : false} size={"small"} label="Active Ingredient" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <DiseaseForm 
                actions={{
                    handleTabChange, 
                    setOpenLoading,
                    setAlertObj
                }} 
                diseaseCategoryOptions={diseaseCategoryOptions}
                savedItem={savedItem}
                diseaseId={diseaseId}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <ActiveIngredientContainer diseaseId={diseaseId}/>
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