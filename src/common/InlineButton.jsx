import { Button } from "@mui/material";

export default function InlineButton(props) {
    return (
        <Button disabled={props.disabled} color={props.color} onClick={props.action} size="small" sx={{
            fontSize: 12, 
            py: "3px", 
            px: "6px",
            mt: "6px",
            ml: "6px",
            minHeight: 0, 
            minWidth: 0}}>
                {props.children}
        </Button>
    );
}