import axios from "axios";
import { useEffect, useState } from "react";
import NestedHeader from "@/common/NestedHeader";
import AlternativeForm from "./AlternativeForm";
import AlternativeList from "./AlternativeList";
import "@/api.config";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';

export default function AlternativeContainer(props) {

    const [openLoading, setOpenLoading] = useState(true);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    
    const [editItem, setEditItem] = useState(null);
    const [navState, setNavState] = useState("list");
    const [alternativeList, setAlternativeList] = useState(null);
    const [drugAlternativesOptions, setDrugAlternativesOptions] = useState(null);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setAlertObj({
            type:'',
            message: '',
            open: false});
    };

    function handleNavState(value) {
        setNavState(value);
    }

    function handleEditItem(item) {
        setEditItem(item);
    }

    function addAlternative(item) {
        setAlternativeList([...alternativeList, item]);
    }

    function editAlternative(editItem) {
        setEditItem(editItem);
        const items = alternativeList.map((item)=>{
            if(+(item.id) === +(editItem.id)) {
                return editItem;
            }
            return item;
        });
        setAlternativeList(items);
    }

    function deleteAlternative(id) {
        const items = alternativeList.filter((item)=>{
            return +(item.alternative_id) !== +id 
        });
        setAlternativeList(items);
    }
   
    function fetchAlternativeItemsOptions() {
        axios.get('api/v1/drugs?range=all&fields=id,name&sort=name.asc')
        .then((response) => {
            setDrugAlternativesOptions(response.data.data);
        })
        .catch((error) => { 
            setAlertObj({
                open: true,
                type: 'error',
                message: "Failed Fetch Alternatives"
            });
        });
    }       

    function fetchAlternativeRelatedToDrug(drugId) {
        axios.get(`api/v1/drugs/${drugId}/alternatives`)
        .then((response)=>{
            setAlternativeList(response.data.data);
        })
        .catch(()=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: "Failed Fetch Alternatives"
            });
        });
    }

    useEffect(() => {
        fetchAlternativeItemsOptions();
        fetchAlternativeRelatedToDrug(props.drugId);
    }, []);

    useEffect(()=>{
        if(drugAlternativesOptions) {
            setOpenLoading(false);
        }
    }, [drugAlternativesOptions]);

    return (
        <>
            <NestedHeader changeNavState={handleNavState}/>

            {(navState === "list") && 
            <AlternativeList
            actions = {{
                deleteAlternative, 
                editAlternative, 
                handleEditItem, 
                handleNavState,
                setOpenLoading,
                setAlertObj}}
            drugId={props.drugId}
            data={alternativeList}/>}

            {(navState === "add") && 
            <AlternativeForm 
            actions={{
                addAlternative,
                setOpenLoading,
                setAlertObj
            }} 
            data={alternativeList}
            drugId={props.drugId} 
            drugAlternativesOptions = {drugAlternativesOptions}
            />}

            {(navState === "edit") && 
            <AlternativeForm 
            actions={{
                editAlternative,
                setOpenLoading,
                setAlertObj
            }} 
            data={alternativeList}
            editItem={editItem}
            drugId={props.drugId} 
            drugAlternativesOptions = {drugAlternativesOptions}
            />}

            <Loading
                open={openLoading}
            />

            <AlertInfo 
            alertObj={alertObj}
            actions={{handleCloseAlert}}/>
        </>
    );
}