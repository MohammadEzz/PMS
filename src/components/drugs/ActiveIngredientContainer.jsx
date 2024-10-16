import axios from "axios";
import { useEffect, useState } from "react";
import "@/api.config";
import ActiveingredientForm from "./ActiveIngredientForm";
import ActiveIngredientHeader from "./ActiveIngredientHeader";
import ActiveIngredientList from "./ActiveIngredientList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';

export default function ActiveIngredientContainer(props) {

    const [openLoading, setOpenLoading] = useState(true);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [navState, setNavState] = useState("list");
    const [editItem, setEditItem] = useState(null);
    const [activeIngredientList, setActiveIngredientList] = useState(null);
    const [activeIngredientOptions, setDrobDownActiveIngredientItems] = useState(null);
    const [dosageOptions, setDrobDownDosageStandard] = useState(null);

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
    
    function handleNavState(value) {
        setNavState(value);
    }
    
    function handleEditItem(item) {
        setEditItem(item);
    }

    function addActiveIngredient(item) {
        setActiveIngredientList([...activeIngredientList, item]);
    }

    function editActiveIngredient(editItem) {
        const items = activeIngredientList.map((item)=>{
            if(+item.pivot.id === +editItem.pivot.id) {
                return editItem;
            }
            return item;
        });
        setActiveIngredientList(items);
    }
    
    function deleteActiveIngredient(id) {
        const items = activeIngredientList.filter((item)=>{
            return +item.id !== +id 
        });
        setActiveIngredientList(items);
    }

    function fetchActiveIngredientRelatedToDrug(drugId) {
        axios.get(`api/v1/drugs/${drugId}/activeingredients`)
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

    function fetchActiveIngredientOptions() {
        axios.get('api/v1/activeingredients?range=all&fields=id,name&sort=name.asc')
        .then((response)=>{
            setDrobDownActiveIngredientItems(response.data.data);
        });
    }

    function fetchDosageOptions() {
        axios.get('api/v1/options?range=all&fields=id,name&filter=type:eq[dose]')
        .then((response)=>{
            setDrobDownDosageStandard(response.data.data);
        });
    }

    useEffect(()=>{
        fetchActiveIngredientOptions();
        fetchDosageOptions();
        fetchActiveIngredientRelatedToDrug(props.drugId)
    },[]);

    useEffect(()=>{
        if(dosageOptions && activeIngredientOptions) {
            setOpenLoading(false);
        }
    }, [dosageOptions, activeIngredientOptions]);

    return (
        <>
            <ActiveIngredientHeader changeNavState={handleNavState}/>

            {(navState === "list") && 
            <ActiveIngredientList 
            actions={{ 
                handleEditItem, 
                handleNavState, 
                deleteActiveIngredient,
                setOpenLoading,
                setAlertObj
             }} 
            data={activeIngredientList} 
            drugId={props.drugId} />}

            {(navState === "add") && 
            <ActiveingredientForm 
            actions={{
                addActiveIngredient,
                setOpenLoading,
                setAlertObj
            }} 
            data={activeIngredientList} 
            drugId={props.drugId} 
            activeIngredientOptions={activeIngredientOptions}
            dosageOptions={dosageOptions}
            />}

            {(navState === "edit") && 
            <ActiveingredientForm 
            actions={{
                editActiveIngredient,
                setOpenLoading,
                setAlertObj
            }}
            data={activeIngredientList}  
            editItem={editItem}
            drugId={props.drugId} 
            activeIngredientOptions={activeIngredientOptions}
            dosageOptions={dosageOptions}
            />}

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