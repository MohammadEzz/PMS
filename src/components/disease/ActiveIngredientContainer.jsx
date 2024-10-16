import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "@/api.config";
import ActiveingredientForm from "./ActiveIngredientForm";
import NestedHeader from "@/common/NestedHeader";
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
    const [activeIngredientOptions, setActiveIngredientOptions] = useState(null);
    const [diseaseActiveIngredient, setDiseaseActiveIngredient] = useState(null);

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
    

    function handleNavState(value) {
        setNavState(value);
    }

    function handleEditItem(item) {
        setEditItem(item);
    }

    function addActiveIngredient(item) {
        setDiseaseActiveIngredient([item, ...diseaseActiveIngredient]);
    }

    function editActiveIngredient(editItem) {

        const items = diseaseActiveIngredient.map((item)=>{
            if(+item.pivot.id === +editItem.pivot.id)
                return editItem;
            else
                return item;
        });
        setDiseaseActiveIngredient(items);
    }
    
    function deleteActiveIngredient(id) {
        const items = diseaseActiveIngredient.filter((item)=>{
            return +item.id !== +id 
        });
        setDiseaseActiveIngredient(items);
    }

    function fetchDiseaseActiveIngredient(diseaseId) {
        axios.get(`api/v1/diseases/${diseaseId}/activeingredients`)
        .then((response)=>{
            setDiseaseActiveIngredient(response.data.data);
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

    function fetchActiveIngredientsOptions() {
        axios.get('api/v1/activeingredients?range=all&sort=name.asc&fields=id,name')
        .then((response)=>{
            setActiveIngredientOptions(response.data.data);
        })
        .catch(()=>{
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

    useEffect(()=>{
        fetchActiveIngredientsOptions();
        fetchDiseaseActiveIngredient(props.diseaseId)
        
    }, [props.deseaseId]);

    return (
        <>
            <NestedHeader changeNavState={handleNavState}/>

            <Container>
                {
                (navState === "list") && 
                <ActiveIngredientList 
                actions={
                    { 
                        handleEditItem, 
                        handleNavState, 
                        deleteActiveIngredient,
                        setOpenLoading,
                        setAlertObj
                    }
                } 
                data={diseaseActiveIngredient} 
                diseaseId={props.diseaseId} />
                }

                {(navState === "add") && 
                <ActiveingredientForm 
                actions={
                    {
                        addActiveIngredient,
                        setOpenLoading,
                        setAlertObj
                    }
                } 
                diseaseId={props.diseaseId}
                data={diseaseActiveIngredient} 
                activeIngredientOptions={activeIngredientOptions} />}

                {
                (navState === "edit") && 
                <ActiveingredientForm 
                actions={
                    {
                        editActiveIngredient,
                        setOpenLoading,
                        setAlertObj
                    }
                } 
                editItem={editItem}
                diseaseId={props.diseaseId}
                data={diseaseActiveIngredient} 
                activeIngredientOptions={activeIngredientOptions}
                />
                }
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