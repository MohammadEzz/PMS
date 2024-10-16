import { Divider, Grid, Link } from "@mui/material";

export default function NestedHeader({ changeNavState }) {

    return (
        <Grid container sx={{mb: 4}}>
            <Link href="#" variant="subtitle1" underline="none"onClick={()=>changeNavState('list')}>All</Link>
            <Divider sx={{mx:1}} orientation="vertical" flexItem/>
            <Link href="#" variant="subtitle1" underline="none" onClick={()=>changeNavState('add')}>Add New</Link>
         </Grid>
    );
}