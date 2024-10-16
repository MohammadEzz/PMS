import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {IconButton, CircularProgress, Fade} from '@mui/material';
import { useCallback, useState } from 'react';
import axios from 'axios';
import '@/api.config';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";

export default function ActiveIngredientList(props) {

    const callBackEditAction = useCallback((activeIngredient)=>{
        props.actions.handleEditItem(activeIngredient);
        props.actions.handleNavState('edit');
    });

    const callBackDeleteAction = useCallback((activeIngredient)=>{
        const activeIngredientId = activeIngredient.id;
        props.actions.setOpenLoading(true);
        axios.delete(`api/v1/diseases/${props.diseaseId}/activeingredients/${activeIngredientId}`)
        .then((response)=>{
            props.actions.deleteActiveIngredient(activeIngredientId);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Active Ingredient'
            });
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Active Ingredient'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    });

    return (
        <>
            <TableContainer component={Paper}>
                <Table  className="list-style"> 
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bold', width: '20px'}}>#</TableCell>
                            <TableCell>Active Ingredient</TableCell>
                            <TableCell style={{width: '100px'}}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                    Array.isArray(props.data) && (props.data.length > 0)
                    ?
                        <Fade 
                        in={true}
                        easing='linear'
                        timeout={150}> 
                            <TableBody>
                                {
                                    props.data.map((activeIngredient, index)=>{
                                        return (
                                            <TableRow  key={activeIngredient.pivot.id} >
                                                <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{index+1}</TableCell>
                                                <TableCell>{ activeIngredient.name }</TableCell>
                                                <TableCell>
                                                <IconButton 
                                                    color="primary" 
                                                    size="small" 
                                                    onClick={()=>callBackEditAction(activeIngredient)}  
                                                    children={<EditIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                    ></IconButton>
                                                        
                                                    <IconButton 
                                                    color="error" 
                                                    size="small" 
                                                    onClick={()=>callBackDeleteAction(activeIngredient)}  
                                                    children={<DeleteIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                    ></IconButton> 
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>       
                        </Fade>     
                        :
                        <TableBody>
                            <TableRow>
                                <TableCell align={"center"} colSpan={5}>
                                {
                                    (Array.isArray(props.data) && (props.data.length === 0))
                                    ? "No Content"
                                    :<CircularProgress size={'small'}/>
                                }
                                </TableCell>
                            </TableRow>
                        </TableBody>    
                    }
                </Table>
            </TableContainer>
        </>
    );
}

