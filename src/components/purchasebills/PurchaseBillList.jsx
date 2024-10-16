import React, { useCallback } from "react";
import {Button, Chip, IconButton, MenuItem, Pagination, Select, CircularProgress, Fade, Paper} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from "@mui/material/TableCell";
import { Box } from "@mui/system";
import {format} from "date-fns";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";

export default function PurchaseBillList(props) {

    const head_title = [
        "Bill Num", 
        "Supplier", 
        "Issue Date",
        "Payment Type",
        "Paid Status", 
        "Bill Status", 
        "Total"].map((title)=>{
            return <TableCell key={title}>{title}</TableCell>;
        });

    function handlePageChange(event, page) {
        props.actions.handlePagination(page);
    }

    function handlePaginationRangeChange(event) {
        props.actions.handlePaginationRangeChange(event.target.value);
    }

    const callBackEditAction = useCallback((event)=>{
        props.actions.editPurchaseBill(event.currentTarget.value);
    }, []);

    const callBackDeleteAction = useCallback((event)=>{
        props.actions.deletePurchaseBill(event.currentTarget.value);
    });

    const callBackViewAction = useCallback((event)=>{
        props.actions.viewPurchaseBill(event.currentTarget.value);
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
                                { head_title }
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
                                    props.data.data.map((bill, index)=>{
                                        return (
                                            <TableRow  key={bill.id} >
                                                <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{+(props.data.from)+index}</TableCell>
                                                <TableCell>{ bill.billnumber }</TableCell>
                                                <TableCell sx={{textTransform:'capitalize'}}>
                                                    <a href="" onClick={(e)=>e.preventDefault()}>{ bill.name }</a>
                                                </TableCell>
                                                <TableCell>{ format(new Date(bill.issuedate), 'dd/MM/yyyy') }</TableCell>
                                                <TableCell sx={{textTransform:'capitalize'}}>{ bill.paymenttype }</TableCell>
                                                <TableCell>
                                                    { 
                                                    (bill.billstatus === 'approved')
                                                    ?
                                                    (
                                                        (bill.paidstatus) === 'unpaid' 
                                                        ? <Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="error" label="UNPAID" />
                                                        : 
                                                        (
                                                            (bill.paidstatus) === 'paid'
                                                            ? <Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="success" label="PAID" />
                                                            : <Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="warning" label="PARTIAL PAID" />
                                                        )
                                                    )
                                                    : '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    { 
                                                    (bill.billstatus === 'approved')
                                                    ?<Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="success" label="APPROVED" />
                                                    :<Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="warning" label="UNDER REVIEW" />
                                                    }
                                                </TableCell>
                                                
                                                <TableCell sx={{fontWeight:'bold'}}>{ Math.round(bill.total*100)/100 }</TableCell>
                                                <TableCell>
                                                    <Link to={`/purchases/${ bill.id}`}>
                                                        <IconButton 
                                                            color="success"
                                                            size="small" 
                                                            
                                                            children={<VisibilityIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                        />
                                                    </Link>
                                                
                                                    {
                                                        (bill.billstatus === 'underreview')
                                                        ?
                                                        <>
                                                        <Link to={`/purchases/${bill.id}/edit`}>
                                                            <IconButton 
                                                                color="primary" 
                                                                size="small" 
                                                                onClick={callBackEditAction}  
                                                                value={bill.id} 
                                                                children={<EditIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                            />
                                                        </Link>
                                                        <IconButton 
                                                        color="error" 
                                                        size="small" 
                                                        onClick={callBackDeleteAction}  
                                                        value={bill.id} 
                                                        children={<DeleteIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                        ></IconButton>
                                                        </>
                                                    :
                                                        <>
                                                            <IconButton 
                                                            color="primary" 
                                                            size="small" 
                                                            disabled
                                                            value={bill.id} 
                                                            children={<EditIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                            ></IconButton>
                                                            
                                                            <IconButton 
                                                            color="error" 
                                                            size="small" 
                                                            disabled
                                                            value={bill.id} 
                                                            children={<DeleteIcon sx={{cursor:'pointer', fontSize:'16px'}} />}
                                                            ></IconButton>
                                                        </>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>       
                            </Fade>
                            :
                            <TableBody>
                                <TableRow>
                                    <TableCell align={"center"} colSpan={9}>
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