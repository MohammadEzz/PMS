import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.actions.handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Conformation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All deleted data will be lost and not retrived again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.actions.handleAcceptAction}>
            Accept
          </Button>
          <Button onClick={props.actions.handleClickClose} autoFocus>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
