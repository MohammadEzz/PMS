import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { Button, Divider, FormLabel, MenuItem, Select } from "@mui/material";
import FormFieldError from "@/common/FormFieldError";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import "@/api.config";

export default function AlternativeForm(props) {

    function addToDb(data) {

        props.actions.setOpenLoading(true);

        axios.post(`api/v1/drugs/${props.drugId}/alternatives`, data)
        .then((response) => {
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Add Alternative'
            });
            props.actions.addAlternative(response.data.data);
            formik.resetForm();
        })
        .catch(() => {
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Add Alternative'
            });
        })
        .finally(() => {
            props.actions.setOpenLoading(false);
        });
    }

    function updateToDb(data) {

        props.actions.setOpenLoading(true);

        axios.put(`api/v1/drugs/${props.drugId}/alternatives/${props.editItem.alternative_id}`, data)
        .then((response) => {
            props.actions.editAlternative(response.data.data);
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit Alternative'
            });
        })
        .catch((error) => {
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit Alternative'
            });
        })
        .finally(() => {
            props.actions.setOpenLoading(false);
        });
    }

    const formik = useFormik({
        initialValues: {
            alternative_id: props.editItem ? props.editItem.alternative_id : ''
        },

        enableReinitialize: true,

        validationSchema: Yup.object({
            alternative_id: Yup.number()
                .required("Please Select Alternative Drug")
                .min(1, "Please Select Alternative Drug")
                .integer()
        }),
        onSubmit: (values) => {
            values.order = 1;
            values.drug_id = props.drugId;
            if (props.editItem) {
                updateToDb(values)
            }
            else {
                addToDb(values);
            }
        }
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel htmlFor="alternative_id">Alternative Drug</FormLabel>
                        </div>
                        <div className="field-form">
                            <Select
                                size="small"
                                id="alternative_id"
                                name="alternative_id"
                                fullWidth
                                displayEmpty
                                error={formik.touched.alternative_id && Boolean(formik.errors.alternative_id)}
                                {...formik.getFieldProps("alternative_id")}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    props.drugAlternativesOptions.map((item) => {
                                        if (+item.id !== +(props.drugId)) {
                                            const disableStatue = props.data.find((drugAlternativeItem) => item.id === drugAlternativeItem.alternative_id);
                                            return (
                                                <MenuItem disabled={disableStatue ? true : false} key={item.id} value={item.id}>{item.name}</MenuItem>
                                            );
                                        }
                                    })
                                }
                            </Select>
                            <FormFieldError name="alternative_id" formik={formik} />
                        </div>
                    </div>

                    <div className='unit-form'>
                        <div className="label-form">
                        </div>
                        <div className="field-form">
                        </div>
                    </div>
                </div>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {
                        (props.editItem)
                        ?
                        <Button className="big-button" variant="contained" color="primary" type="submit">
                            Edit
                            <Divider orientation="vertical" color="#fff" light sx={{ mx: 1 }} />
                            <EditIcon size="small" />
                        </Button>
                        :
                        <Button className="big-button" variant="contained" color="success" type="submit">
                            Add New
                            <Divider orientation="vertical" color="#fff" light sx={{ mx: 1 }} />
                            <AddIcon />
                        </Button>
                    }
                </Box>
            </form>
        </>
    );
}