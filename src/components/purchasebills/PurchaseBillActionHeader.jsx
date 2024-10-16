import { Box, Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
export default function PurchaseBillActionHeader(props) {
    return (
        <Box sx={{my:"10px"}}>
            <Button 
            variant="contained" 
            color="success" 
            size="small"
            onClick={props.actions.approvePurchaseBill}>
                Click to Approve Bill
            </Button>
            <Link to={`/purchases/${props.purchaseBillId}/edit`}>
                <IconButton 
                sx={{float:'right'}}
                color="primary" 
                variant="outlined" 
                size="small" 
                onClick={props.actions.editPurchaseBill}
                children={
                    <EditIcon />
                } />
            </Link>
        </Box>
    );
}