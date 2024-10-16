import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useCallback, useEffect } from 'react';
import axios from 'axios';
import '@/api.config';
import { IconButton, CircularProgress, Fade } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";

export default function ContraindicationList(props) {

    const callBackEditAction = useCallback((event) => {

        const item = props.data.filter((contraindication) => {
            return +contraindication.id === +event.currentTarget.value
        })
        props.actions.handleEditItem(item[0]);
        props.actions.handleNavState('edit');
    });

    const callBackDeleteAction = useCallback((event) => {

        const contraindicationId = event.currentTarget.value;
        props.actions.setOpenLoading(true);
        axios.delete(`api/v1/drugs/${props.drugId}/contraindications/${contraindicationId}`)
        .then((response) => {
            props.actions.deleteContraindication(contraindicationId);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete Contraindicaion'
            })
        })
        .catch((error) => {
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete Contraindicaion'
            })
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    });

    return (
        <div className="container-table">
            <TableContainer component={Paper}>
                <Table className="list-style">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bold', width: '20px'}}>{"#"}</TableCell>
                            <TableCell>{"Category"}</TableCell>
                            <TableCell>{"Level"}</TableCell>
                            <TableCell>{"Description"}</TableCell>
                            <TableCell style={{width: '100px'}}>{"Action"}</TableCell>
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
                                props.data.map((contraindication, index) => {
                                    return (
                                        <TableRow key={contraindication.id} >
                                            <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{index+1}</TableCell>
                                            <TableCell>{contraindication.category}</TableCell>
                                            <TableCell>{contraindication.level}</TableCell>
                                            <TableCell>{contraindication.description}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={callBackEditAction}
                                                    value={contraindication.id}
                                                    children={<EditIcon sx={{ cursor: 'pointer', fontSize: '16px' }} />}
                                                ></IconButton>

                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={callBackDeleteAction}
                                                    value={contraindication.id}
                                                    children={<DeleteIcon sx={{ cursor: 'pointer', fontSize: '16px' }} />}
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
                                    :<CircularProgress />
                                }
                                </TableCell>
                            </TableRow>
                        </TableBody> 
                        }  
                </Table>
            </TableContainer>
        </div>
    );
}

