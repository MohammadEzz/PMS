import { format } from "date-fns";
import Divider from '@mui/material/Divider';
import { Chip } from "@mui/material";

export default function PurchaseBillInfoView(props) {
    return (
        <>
        {
            props.savedItem
            &&
            <section className="info-block">
                <div className='info-header'>
                    <div className='small-block left number'>{props.savedItem.billnumber}</div>
                    
                    <div className="clearfix"></div>
                </div>
                <Divider className="divider" />

                <div className="info-row">
                    <div><span className="label">Supplier</span> <a href="" onClick={(e)=>e.preventDefault()}>{props.savedItem.supplier}</a></div>
                    <div><span className="label">Dealer</span> <a href="" onClick={(e)=>e.preventDefault()}>{props.savedItem.dealer}</a></div>
                </div>

                <div className="info-row">
                    <div><span className="label">Payment Type</span> {props.savedItem.paymenttype}</div>
                    <div><span className="label">Paid Status</span> {
                       
                    (props.savedItem.paidstatus) === 'unpaid' 
                    ? <Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="error" label="UNPAID" />
                    : (
                        (props.savedItem.paidstatus) === 'paid'
                        ? <Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="success" label="PAID" />
                        : <Chip sx={{fontSize:'11px'}} variant="contained" size="small" color="warning" label="PARTIAL PAID" />
                        )
                        
                    }</div>
                </div>

                <div className="info-row">
                    <div><span className="label">Issue Date</span> {format(new Date(props.savedItem.issuedate), 'dd/MM/yyyy')}</div>
                    <div><span className="label">Total</span> <span className="total">{Math.round(props.savedItem.total*100)/100}</span></div>
                </div>
            </section>
        }
            
        </>
    );
}