import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NestedHeader from "@/common/NestedHeader";
import ContraindicationForm from "./ContraindicationForm";
import ContraindicationList from "./ContraindicationList";
import "@/api.config";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';

export default function ContraindicationContainer(props) {

    const [openLoading, setOpenLoading] = useState(true);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });
    const [contraindicationCategoryOptions, setDrobDownContraindicationCategory] = useState(null);
    const [contraindicationLevelOptions, setDrobDownContraindicationLevel] = useState(null);
    const [contraindicationList, setContraindicationList] = useState(null);
    const [navState, setNavState] = useState("list");
    const [editItem, setEditItem] = useState(null);

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

    function fetchContraindicationCategoryOptions() {
        axios.get('api/v1/options?range=all&fields=id,name&filter=type:eq[contraindication_category]')
        .then((response)=>{
            setDrobDownContraindicationCategory(response.data.data);
        })
        .catch((error)=>{});
    }

    function fetchContraindicationLevelOptions() {
        axios.get('api/v1/options?range=all&fields=id,name&filter=type:eq[contraindication_level]')
        .then((response)=>{
            setDrobDownContraindicationLevel(response.data.data);
        })
        .catch((error)=>{});
    }

    function addContraindication(item) {
        setContraindicationList([...contraindicationList, item]);
    }

    function editContraindication(editItem) {
        const items = contraindicationList.map((item)=>{
            if(+(item.id) === +(editItem.id)) {
                return editItem;
            }
            return item;
        });
        setContraindicationList(items);
    }
    
    function deleteContraindication(id) {
        const items = contraindicationList.filter((item)=>{
            return +(item.id) !== +id 
        });
        setContraindicationList(items);
    }

    function fetchDrugContraindications(drugId) {
        axios.get(`api/v1/drugs/${drugId}/contraindications`)
        .then((response)=>{
            setContraindicationList(response.data.data);
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: "Failed ON Fetch Drug Contraindication"
            });
        });
    }

    // Load all contraindication category and level options for drobdown
    // and all contraindication related to drug
    useEffect(()=>{
        fetchContraindicationCategoryOptions();
        fetchContraindicationLevelOptions();
        fetchDrugContraindications(props.drugId);
    }, []);

    // Close open loading when categy,level options 
    // and contraindication list completely loaded
    useEffect(()=>{
        if(contraindicationCategoryOptions 
        &&
        contraindicationLevelOptions) {
            setOpenLoading(false);
        }

    }, [contraindicationCategoryOptions, contraindicationLevelOptions]);

    // hanlde navigation between list, edit and add contraindication frames
    function handleNavState(value) {
        setNavState(value);
    }

    function handleEditItem(item) {
        setEditItem(item);
    }

    return (
        <>
            <Container>
                <NestedHeader changeNavState={handleNavState}/>
                
                {(navState === "list") && 
                <ContraindicationList
                actions = {{
                    deleteContraindication, 
                    editContraindication, 
                    handleEditItem, 
                    handleNavState,
                    setOpenLoading,
                    setAlertObj
                }}
                drugId={props.drugId}
                data={contraindicationList}/>}

                {(navState === "add") && 
                <ContraindicationForm 
                actions={{
                    addContraindication,
                    setOpenLoading,
                    setAlertObj
                }} 
                drugId={props.drugId} 
                contraindicationCategoryOptions={contraindicationCategoryOptions}
                contraindicationLevelOptions={contraindicationLevelOptions}
                />}

                {(navState === "edit") && 
                <ContraindicationForm 
                actions={{
                    editContraindication,
                    setOpenLoading,
                    setAlertObj
                }} 
                editItem={editItem}
                drugId={props.drugId} 
                contraindicationCategoryOptions={contraindicationCategoryOptions}
                contraindicationLevelOptions={contraindicationLevelOptions}
                />}

            </Container>

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