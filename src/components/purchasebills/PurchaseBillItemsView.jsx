import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {format} from 'date-fns';
export default function PurchaseBillItemsView(props) {
    return (
        <Table className="bill-style">
            <TableHead>
                <TableRow>
                    <TableCell style={{fontWeight:"bold", width:'30px'}}>#</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '150px'}} align="left">Drug Name</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Quantity</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Bonus</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '100px'}} align="center">Ex-Date</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} width={3} align="center">S-Price</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#F7D7D7', width: '50px'}} align="center">Discount(%)</TableCell>
                    <TableCell style={{fontWeight:"bold", width: '50px'}} align="center">Tax(%)</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#fffbc5', width: '50px'}} align="center">P-Price</TableCell>
                    <TableCell style={{fontWeight:"bold", backgroundColor:'#D4EEE3', width: '100px'}} align="center">Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {props.rows.map((row, index) => (
                <TableRow 
                key={row.drugid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell>{index+1}</TableCell>
                <TableCell  align="left">{row.name}</TableCell>
                <TableCell  align="center">
                    { row.quantity }
                </TableCell>
                <TableCell align="center">
                    { row.bonus }
                </TableCell>
                <TableCell  align="center">
                    { (row.exdate) ? format(new Date(row.exdate), 'MM/yy') : '-' }
                </TableCell>
                <TableCell  align="center">
                    { row.sprice }
                </TableCell>
                <TableCell  style={{backgroundColor:'#F7D7D7', textAlign:'center'}}>
                    { row.discount }
                </TableCell>
                <TableCell  align="center">
                    { row.tax }
                </TableCell>
                <TableCell  style={{backgroundColor:'#fffbc5', textAlign:'center'}}>{row.pprice || 0}</TableCell>
                <TableCell style={{backgroundColor:'#D4EEE3', textAlign:'center'}}>{Math.round((+row.pprice * +row.quantity)*1000)/1000}</TableCell>
                </TableRow>

            ))}
                <TableRow>
                    <TableCell colSpan={9} sx={{backgroundColor: '#f7f7f7', borderBottom:"2px solid #f7f7f7"}}></TableCell>
                    <TableCell style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor:'#D4EEE3'}}>{Math.round(props.total*100)/100}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}