import Snackbar from '@mui/material/Snackbar';
import React, { useState } from 'react';
import { Alert } from '@mui/material';

export default function AlertInfo(props) {
  return (
    <div>
        <Snackbar
            open={props.alertObj.open}
            autoHideDuration={6000}
            onClose={props.actions.handleCloseAlert}
        >
            <Alert 
            variant="filled" 
            severity={props.alertObj.type || 'info'} 
            sx={{ width: '100%' }} 
            onClose={props.actions.handleCloseAlert}>
                {props.alertObj.message}
            </Alert>
      </Snackbar>
    </div>
  );
}
