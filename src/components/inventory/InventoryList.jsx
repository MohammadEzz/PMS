import React from "react";
import {MenuItem, Pagination, Select, CircularProgress, Fade, Paper} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from "@mui/system";
import {format} from "date-fns";
import TableCell from "@mui/material/TableCell";

export default function InventoryList(props) {

    function handlePageChange(event, page) {
        props.actions.handlePagination(page);
    }

    function handlePaginationRangeChange(event) {
        props.actions.handlePaginationRangeChange(event.target.value);
    }

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
                            <TableCell>Drug Name</TableCell>
                            <TableCell style={{textAlign: 'center'}}>Quantity</TableCell>
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
                                props.data.data.map((inventory, index)=>
                                <TableRow  key={inventory.name} >
                                    <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{+(props.data.from)+index}</TableCell>
                                    <TableCell sx={{textTransform:'capitalize'}}>
                                        <a href="" onClick={(e)=>e.preventDefault()}>
                                            {inventory.name}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <div className="quantity-style">
                                            <span className="whole-part">
                                                {(inventory.quantity).toString().split('.')[0]}
                                            </span>
                                            <span className="seperator">:</span>
                                            <span className="decimal-part">
                                                {
                                                    (inventory.quantity).toString().split('.')[1]
                                                    ? +('.'+((inventory.quantity).toString().split('.')[1])) * inventory.middleunitnum
                                                    : 0
                                                }
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                )
                            }
                        </TableBody>       
                    </Fade>
                    :
                    <TableBody>
                        <TableRow>
                            <TableCell align={"center"} colSpan={3}>
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