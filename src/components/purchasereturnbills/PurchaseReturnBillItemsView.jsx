import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import  "@/api.config";

export default function PurchaseReturnBillItemsView(props) {
    return(
        <Table className="bill-style" style={{backgroundColor:'white'}}>
            <TableHead>
                <TableRow>
                    <TableCell style={{fontWeight:"bold", width:'30px'}}>#</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '150px'}} align="left">Drug Name</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#fffbc5', width: '50px'}} align="center">Quantity</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#fffbc5', width: '50px'}} width={3} align="center">Price</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Inventory QTY</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '100px'}} align="center">Ex-Date</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Discount(%)</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Tax(%)</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">P-Price</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#D4EEE3', width: '100px'}} align="center">Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {props.rows.map((row, index) => (
                <TableRow
                key={row.drugid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className={(props.invalidQuantity.find((index)=>+index === +row.id)) !== undefined ? 'invalid' : ''}
                >
                <TableCell component="th" scope="row">
                    {index+1}
                </TableCell>
                <TableCell  align="left">{row.name}</TableCell>
                <TableCell  
                className={(props.invalidQuantity.find((index)=>+index === +row.id)) !== undefined ? 'invalid' : ''}
                style={{backgroundColor:'#fffbc5', textAlign:'center'}}>
                    { row.quantity }
                </TableCell>
                <TableCell  style={{backgroundColor:'#fffbc5', textAlign:'center'}}>
                    { Math.round(row.price*100)/100 }
                </TableCell>
                <TableCell  
                className={(props.invalidQuantity.find((index)=>+index === +row.id)) !== undefined ? 'invalid' : ''}
                align="center">
                    { 
                        row.inventoryqty
                    }
                </TableCell>
                <TableCell  align="center">
                    { 
                        (row.exdate) ? format(new Date(row.exdate), 'MM/yy') : '-'
                    }
                </TableCell>
            
                <TableCell  style={{textAlign:'center'}}>
                    {
                        Math.round(row.discount*100)/100
                    }
                </TableCell>
                <TableCell  align="center">
                    {
                        Math.round(row.tax*100)/100
                    }
                </TableCell>
                <TableCell>{Math.round(row.pprice*100)/100 || 0}</TableCell>
                <TableCell style={{backgroundColor:'#D4EEE3', textAlign:'center'}}>{Math.round((+row.price * +row.quantity)*1000)/1000}</TableCell>
                </TableRow>

            ))}
                <TableRow>
                    <TableCell colSpan={9} sx={{backgroundColor: '#f3f3f3', borderBottom:"2px solid #f3f3f3"}}></TableCell>
                    <TableCell style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor:'#D4EEE3'}}>{Math.round(props.actions.handeFetchReturnBillTotal()*100)/100}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}