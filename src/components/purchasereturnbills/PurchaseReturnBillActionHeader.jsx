import { Box, Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
export default function PurchaseReturnBillActionHeader(props) {
    return (
        <div className="container-action">
            <Button 
            variant="contained" 
            color="success" 
            size="small"
            onClick={props.actions.approveReturnBill}
            >
                Click to Approve Bill
            </Button>
            <Link to={props.link || null}>
                <IconButton 
                sx={{float:'right'}}
                color="primary" 
                variant="outlined" 
                size="small" 
                children={
                    <EditIcon />
                } />
            </Link>
           
        </div>
    );
}