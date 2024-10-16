import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import UserList from "./UserList";
import Loading from "@/common/Loading";
import AlertInfo from '@/common/AlertInfo';
import MainHeader from '@/common/MainHeader';

export default function UserListContainer() {

    const [openLoading, setOpenLoading] = useState(false);
    const [alertObj, setAlertObj] = useState({
        open: false,
        type: '',
        message: ''
    });

    const [range, setRange] = useState(20);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    
    function editUser(id) {
        dispatch({
            type: 'sidenav/user-add-edit'
        });

        dispatch({
            type: 'user/store-edit-user-id',
            payload: {
                userId: id, 
                tabIndex: 0
            }
        });
    }

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

    function deleteUser(id) {
        setOpenLoading(true);
        axios.delete(`api/v1/users/${id}`)
        .then(()=>{
            fetchUser(page, range);
            setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Delete User'
            });
        })
        .catch((error)=>{
            setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Delete User'
            });
        })
        .finally(()=>{
            setOpenLoading(false);
        });
    }

    function fetchUser(page, range) {
        axios.get(`api/v1/users?page=${page}&range=${range}`)
        .then((response)=>{
            setUsers(response.data.data);
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

    function handlePagination(page) {
        setPage(page);
    }

    function handlePaginationRangeChange(range){ 
        setRange(range);
        setPage(1);   
    }

    useEffect(()=>{ 
        fetchUser(page, range);
    }, [page, range]);

    return(
        <>
            <MainHeader title={"List All Users"}></MainHeader>

            <Container>
               <UserList actions={{editUser, deleteUser, handlePagination, handlePaginationRangeChange}} data={users} />   
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