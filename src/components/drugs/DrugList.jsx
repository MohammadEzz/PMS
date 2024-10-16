import React, { useCallback, useState} from "react";
import {MenuItem, Pagination, Select, IconButton, CircularProgress, Fade, Chip} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "@/common/AlertDialog";
import { Link } from "react-router-dom";

export default function DrugList(props) {

    const[openDialog, setOpenDialog] = useState(false);
    const[deletedItemId, setDeletedItemId] = useState(null);

    function handlePageChange(event, page) {
        props.actions.handlePagination(page);
    }

    function handlePaginationRangeChange(event) {
        props.actions.handlePaginationRangeChange(event.target.value);
    }

    const callBackEditAction = useCallback((event)=>{
        props.actions.editDrug(event.currentTarget.value);
    });

    
    const handleClickOpen = () => {
        setOpenDialog(true);
    }
    const handleClickClose = () => {
        setOpenDialog(false);
    };
    
    const handleAcceptAction = () => {
        props.actions.deleteDrug(deletedItemId);
        setOpenDialog(false);
        props.actions.handleOpenLoading();
    }
         
    const callBackDeleteAction = useCallback((event)=>{
        setOpenDialog(true);
        setDeletedItemId(event.currentTarget.value);
    });
    
    return( 
            <>
            {
                props.data
                &&
                <Box sx={{py: 1}}>
                    <Select
                    className="pagination-range"
                    id="pagination-range"
                    value={props.data.per_page ?? 20}
                    onChange={handlePaginationRangeChange}
                    size={"small"}
                    sx={{mr: 1, p: 0}}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={props.data.total}>All</MenuItem>
                    </Select>
                    <span> {props.data.from} - {props.data.to} of {props.data.total}</span>
                </Box>
            }

            <div className="container-table">
                <TableContainer component={Paper}>
                    <Table className="list-style">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold', width: '20px'}}>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Barcode</TableCell>
                                <TableCell>M Unit Num#</TableCell>
                                <TableCell>S Unit Num#</TableCell>
                                <TableCell>Visible</TableCell>
                                <TableCell style={{width: '100px'}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            (Array.isArray(props.data.data) && (props.data.data.length > 0))
                            ?
                            <Fade 
                            in={true}
                            easing='linear'
                            timeout={150}> 
                                <TableBody>
                                    {
                                        props.data.data.map((drug, index)=>{
                                            return (                                          
                                                <TableRow  key={drug.id} >
                                                    <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{+(props.data.from)+index}</TableCell>
                                                    <TableCell>{ drug.name }</TableCell>
                                                    <TableCell>{ drug.type }</TableCell>
                                                    <TableCell>{ drug.barcode }</TableCell>
                                                    <TableCell>{ drug.middleunitnum }</TableCell>
                                                    <TableCell>{ drug.smallunitnum }</TableCell>
                                                    <TableCell>{ 
                                                    (+(drug.visible) === 1)
                                                        ?<Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="success" label="VISIBLE" />
                                                        :<Chip sx={{fontSize:'11px'}} variant="contained" size="small" label="HIDDEN" />
                                                    }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link to={`/drugs/${drug.id}`}>
                                                            <IconButton 
                                                                color="primary" 
                                                                size="small" 
                                                                
                                                                children={<EditIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                            />
                                                        </Link>
                                                        
                                                        
                                                        {
                                                            (drug.maxbillqty)
                                                            ?
                                                            <IconButton 
                                                            color="error" 
                                                            size="small" 
                                                            disabled={true}
                                                            value={drug.id} 
                                                            children={<DeleteIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                            ></IconButton>
                                                            :
                                                            <IconButton 
                                                            color="error" 
                                                            size="small" 
                                                            onClick={callBackDeleteAction}  
                                                            value={drug.id} 
                                                            children={<DeleteIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                            ></IconButton>
                                                        }
                                                                        
                                                    </TableCell>
                                                </TableRow> 
                                            );
                                        })
                                    }
                                </TableBody>       
                            </Fade>
                            :
                            <TableBody>
                                <TableRow>
                                    <TableCell align={"center"} colSpan={8}>
                                    {
                                        (Array.isArray(props.data.data) && (props.data.data.length === 0))
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
            <Box sx={{display:"flex", justifyContent: "end", py: 2}}>
                {
                    props.data
                    &&
                    <Pagination
                    onChange={handlePageChange}
                    count={props.data.last_page}
                    showFirstButton={true}
                    showLastButton={true}
                    page={props.data.current_page ?? 0}
                    variant="outlined" 
                    color="primary"
                    size="small"
                    />
                }
            </Box>  

            <AlertDialog open={openDialog} actions={{
                handleClickOpen,
                handleClickClose,
                handleAcceptAction}}/>
            </>
    );
}