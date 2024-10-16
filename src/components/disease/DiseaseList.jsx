import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useCallback } from 'react';
import axios from 'axios';
import '@/api.config';
import {IconButton, MenuItem, Pagination, Select, CircularProgress, Fade} from '@mui/material';
import { Box } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from 'react-router-dom';

export default function DiseaseList(props) {
    
    function handlePageChange(event, page) {
        props.actions.handlePagination(page);
    }

    function handlePaginationRangeChange(event) {
        props.actions.handlePaginationRangeChange(event.target.value);
    }

    const callBackEditAction = useCallback((event)=>{
        props.actions.editDisease(event.currentTarget.value);
    });

    const callBackDeleteAction = useCallback((event)=>{
        props.actions.deleteDisease(event.currentTarget.value);
    });

    return (
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
                    <Table  className="list-style"> 
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold', width: '20px'}}>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Global Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell style={{width: '100px'}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                        Array.isArray(props.data.data) && (props.data.data.length > 0)
                        ?
                        <Fade 
                        in={true}
                        easing='linear'
                        timeout={150}> 
                            <TableBody>
                                {
                            props.data.data.map((disease, index)=>{
                                return (
                                    <TableRow  key={disease.id} >
                                        <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{+(props.data.from)+index}</TableCell>
                                        <TableCell>{ disease.name }</TableCell>
                                        <TableCell>{ disease.globalname }</TableCell>
                                        <TableCell>{ disease.category }</TableCell>
                                        <TableCell>
                                            <Link to={`edit/${disease.id}`}>
                                            <IconButton 
                                            color="primary" 
                                            size="small" 
                                            // onClick={callBackEditAction}  
                                            // value={disease.id} 
                                            children={<EditIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                            />
                                            </Link>
                                       
                                                
                                            <IconButton 
                                            color="error" 
                                            size="small" 
                                            onClick={callBackDeleteAction}  
                                            value={disease.id} 
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
        </>
    );
}

