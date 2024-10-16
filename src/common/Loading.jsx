import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function Loading(props) {
  return (
    <div className="container-loading">
      <Backdrop
        className="loading-page"
        size={props.size}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.open}
      >
        <CircularProgress 
        size={20}
        color="inherit" />
      </Backdrop>
    </div>
  );
}
