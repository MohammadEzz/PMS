import { useCallback } from "react";
import { Chip, IconButton, MenuItem, Pagination, Select, Fade, CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import { Box } from "@mui/system";
import { format } from "date-fns";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

export default function UserList(props) {

    function handlePageChange(event, page) {
        props.actions.handlePagination(page);
    }

    function handlePaginationRangeChange(event) {
        props.actions.handlePaginationRangeChange(event.target.value);
    }

    const callBackEditAction = useCallback((event) => {
        props.actions.editUser(event.currentTarget.value);
    });

    const callBackDeleteAction = useCallback((event) => {
        props.actions.deleteUser(event.currentTarget.value);
    });

    return (
        <>
            {
                props.data
                &&
                <Box sx={{ py: 1 }}>
                    <Select
                        className="pagination-range"
                        id="pagination-range"
                        value={props.data.per_page ?? 20}
                        onChange={handlePaginationRangeChange}
                        size={"small"}
                        sx={{ mr: 1, p: 0 }}
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
                                <TableCell>Email</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Visible</TableCell>
                                <TableCell>Last Login</TableCell>
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
                                    props.data.data.map((user, index) => {
                                        return (
                                            <TableRow key={user.id} >
                                                <TableCell style={{fontWeight: 'bold', borderRight:'1px solid #ddd'}}>{+(props.data.from)+index}</TableCell>
                                                <TableCell>{user.firstname + " " + user.lastname}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell style={{textTransform: 'capitalize'}}>{user.gender}</TableCell>
                                                <TableCell>{user.country}</TableCell>
                                                <TableCell>{user.status}</TableCell>
                                                <TableCell>
                                                {
                                                    (user.visible === 'visible')
                                                    ?<Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="success" label="VISIBLE" />
                                                    :<Chip sx={{fontSize:'11px'}} variant="contained" size="small" label="HIDDEN" />
                                                 }
                                                </TableCell>
                                                <TableCell>{(user.lastlogin) ? format(new Date(user.lastlogin), 'dd/MM/yyyy - h:m a') : '-'}</TableCell>
                                                <TableCell>
                                                    <Link to={`edit/${user.id}`}>
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        // onClick={callBackEditAction}
                                                        // value={user.id}
                                                        children={<EditIcon sx={{ cursor: 'pointer', fontSize: '16px' }} />}
                                                   /></Link>

                                                    {
                                                        (user.lastlogin)
                                                        ?
                                                        <IconButton
                                                        color="error"
                                                        size="small"
                                                        disabled={true}
                                                        value={user.id}
                                                        children={<DeleteIcon sx={{ cursor: 'pointer', fontSize: '16px' }} />}
                                                        ></IconButton>
                                                        :
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={callBackDeleteAction}
                                                            value={user.id}
                                                            children={<DeleteIcon sx={{ cursor: 'pointer', fontSize: '16px' }} />}
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
                                    <TableCell align={"center"} colSpan={10}>
                                    {
                                        (Array.isArray(props.data.data) && (props.data.data.length === 0))
                                        ? "No Content"
                                        :<CircularProgress size={30}/>
                                    }
                                    </TableCell>
                                </TableRow>
                            </TableBody> 
                            }
                    </Table>
                </TableContainer>
            </div>
            <Box sx={{ display: "flex", justifyContent: "end", py: 2 }}>
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