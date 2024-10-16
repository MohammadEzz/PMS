import { Box } from "@mui/system";

export default function FormFieldError(props) {
    return (
        <>
         {
         (props.formik.errors[props.name] && props.formik.touched[props.name] ) 
         && 
         <Box position="absolute" mt={"3px"} sx={{color: "red", fontSize: 12}}>{props.formik.errors[props.name]}</Box>
         }
        </>
    );
}