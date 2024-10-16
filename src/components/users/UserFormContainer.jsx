import { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import { Box } from '@mui/system';
import { Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import UserForm from './UserForm';
import TabPanel from '@/common/TabPanel';
import axios from "axios";
import "@/api.config";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';
import { useGridApiEventHandler } from "@mui/x-data-grid";

 function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function UserFormContainer() {

    const {userId} = useParams();
    
    const [openLoading, setOpenLoading] = useState(true);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [tabIndex, setTabIndex] = useState(0);
    const [savedItem, setSavedItem] = useState(null);
    const [countriesOptions, setCountriesOptions] = useState(null);
    const [citiesOptions, setCitiesOptions] = useState(null);
    const [userStatusOptions, setUserStatusOptions] = useState(null);

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

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    function handleAssignSavedItem(values) {
        setSavedItem(values);
    }

    function fetchUser(userId) {
        axios.get(`api/v1/users/${userId}`)
        .then((response)=>{
            setSavedItem(response.data.data);
            // setTabIndex(selectUser.tabIndex);
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

    // Fetch Countries
    function fetchCountries() {
        axios.get('api/v1/countries?range=all&fields=id,nicename,iso')
        .then((response)=>{
            setCountriesOptions(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    // Fetch Cities
    function fetchCitites() {
        axios.get('api/v1/cities?range=all&fields=id,name&sort=name.asc')
        .then((response)=>{
            setCitiesOptions(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    // Fetch User Status
    function fetchUserStatus() {
        axios.get('api/v1/options?range=all&fields=id,name&filter=type:eq[user_status]')
        .then((response)=>{
            setUserStatusOptions(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
            setOpenLoading(false);
        });
    }

    useEffect(()=>{
        if(userId && savedItem === null){
            fetchUser(userId);
        }
        else setSavedItem(null);
    }, [userId]);

    useEffect(()=>{
        fetchCountries();
        fetchCitites();
        fetchUserStatus();
    }, []);

    useEffect(()=>{
        if(useGridApiEventHandler && countriesOptions && citiesOptions && userStatusOptions && savedItem) {
            setOpenLoading(false);
        }
        else if(countriesOptions && citiesOptions && userStatusOptions) {
            setOpenLoading(false);
        }
    }, [countriesOptions, citiesOptions, userStatusOptions, savedItem, userId]);

    return(
        <>
            <MainHeader title={
                userId
                ? "Edit User"
                : "Add New User"} />

            <Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="User Froms">
                    <Tab size={"small"} label="User Info" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <UserForm 
                actions={{
                    handleTabChange, 
                    handleAssignSavedItem,
                    setOpenLoading,
                    setAlertObj
                }} 
                countriesOptions={countriesOptions}
                citiesOptions={citiesOptions}
                userStatusOptions={userStatusOptions}
                savedItem={savedItem} 
                userId={userId}/>
            </TabPanel>

            <Loading
            open={openLoading}
            />

            <AlertInfo 
            alertObj={alertObj}
            actions={{handleCloseAlert}}/>
        </>
    );
}