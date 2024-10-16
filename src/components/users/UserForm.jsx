import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '@/api.config';
import { TextField,Checkbox, Select, MenuItem, FormLabel, Button, Divider, RadioGroup, FormControlLabel, Radio, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FormFieldError from '../../common/FormFieldError';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CONFIG from "@/app.config";
import {format} from "date-fns";
import InlineButton from '@/common/InlineButton';
import {useCallback, useState, useEffect} from 'react';
import {debounceCheckUniqueValue} from '@/helper/Debounce';
import { useNavigate } from 'react-router-dom'; 

export default function UserForm(props) {

    function checkUniqueValue(formikObj, field, value, fieldValueStatus) {
        return (axios.get(`api/v1/users?range=all&filter=${field}:eq[${value}]`)
        .then((response)=>{
            (response.data.data.length === 0)
            ? formikObj.setFieldValue(fieldValueStatus, true)
            : formikObj.setFieldValue(fieldValueStatus, false);
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Server Error'
            });
        })
        );
    }

    function prepareValuesBeforeSend(values, country, defaultCountry) {
        let cloneValues = {...values};
        if(country === defaultCountry)
            delete cloneValues.passportnum;
        else if(country && setCountryISO !== defaultCountry)
            delete cloneValues.city;
    
        return cloneValues;
    }

    const navigate = useNavigate();
    function addToDb(values) {
        props.actions.setOpenLoading(true);
        axios.post('api/v1/users', values)
        .then((response)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Added User'
            });

            setTimeout(()=>{
                navigate("/users");
            }, 500);
        })
        .catch((error)=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Added User'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });  
    }
    
    function updateToDb(values) {

        props.actions.setOpenLoading(true);

        axios.put(`api/v1/users/${props.userId}`, values)
        .then(()=>{    
            props.actions.setAlertObj({
                open: true,
                type: 'success',
                message: 'Successfully Edit User'
            });
            
            setTimeout(()=>{
                navigate("/users");
            }, 500);
        })
        .catch(()=>{
            props.actions.setAlertObj({
                open: true,
                type: 'error',
                message: 'Failed Edit User'
            });
        })
        .finally(()=>{
            props.actions.setOpenLoading(false);
        });
    } 

    let checkUniquNationalId= useCallback(debounceCheckUniqueValue(checkUniqueValue, 1500), []);
    let checkUniquPassportNum= useCallback(debounceCheckUniqueValue(checkUniqueValue, 1500), []);
    let checkUniquUserName = useCallback(debounceCheckUniqueValue(checkUniqueValue, 1500), []);
    let checkUniquEmail= useCallback(debounceCheckUniqueValue(checkUniqueValue, 1500), []);

    /**************************************
     * Formik For All User Form On Add Mode
     **************************************/
    let validationObject = Yup.object().shape({
        editmode: Yup.boolean(),
        editmodeemail: Yup.boolean(),
        editmodepassword: Yup.boolean(),

        nationalidstatus: Yup.boolean(),
        passportnumstatus: Yup.boolean(),
        usernamestatus: Yup.boolean(),
        emailstatus: Yup.boolean(),

        firstname: Yup.string()
        .required('First Name Is Required')
        .min(2, "At Least 2 Character")
        .max(100, "At Most 100 Character"),

        middlename: Yup.string()
        .min(2, "At Least 2 Character")
        .max(100, "At Most 100 Character"),

        lastname: Yup.string()
        .required('Last Name Is Requried')
        .min(2, "At Least 2 Character")
        .max(100, "At Most 100 Character"),

        gender: Yup.string()
        .required("Gender Is Requried"),

        birthdate: Yup.date()
        .typeError("Date Of Birth is Required")
        .required("Date Of Birth is Required"),

        country: Yup.number()
        .typeError("Country is Required")
        .required("Country is Required")
        .min(1, "Country is Required")
        .integer("Country is Required"),

        city: Yup.mixed().when('country', {
            is: (value)=>{
                let country = (props.countriesOptions) ? props.countriesOptions.find((country) => +country.id === +value) : null;
                return (country && country.iso === env.DEFAULT_COUNTRY) ? true : false;
            },
            then: Yup.number()
            .typeError("City is Required")
            .required("City is Required")
            .min(1, "City is Required")
            .integer("City is Required"),
            otherwise: null
        }),

        address: Yup.string()
        .required("Address is required")
        .min(4, "At Least 4 Character")
        .max(1000, "At Most 1000 Character"),
        
        nationalid: Yup.string()
        .required("National ID is required")
        .matches(/^[0-9]{14}$/, "National ID not correct")
        .when('nationalidstatus', {
            is: (value)=>!value===true,
            then: Yup.string().test('check-unique-nationalid', "National ID Is Exist", ()=>false),
            otherwise: null,
        }),

        passportnum: Yup.mixed().when('country', {
            is: (value)=>{
                let country = props.countriesOptions ? (props.countriesOptions.find((country) => +country.id === +value)) : null;
                return (country && country.iso !== CONFIG.DEFAULT_COUNTRY) ? true : false;
            },
            then: Yup.string()
            .typeError("Passport Number is Required")
            .required("Passport Number is Required")
            .matches(/^(?!^0+$)[a-zA-Z0-9]{6,9}$/, "Passport Number not correct")
            .when('passportnumstatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-passportnum', "Passport Number Is Exist", ()=>false),
                otherwise: null,
            }),
            otherwise: null
        }),

        username: Yup.mixed().when('editmode', {
            is : (value) => value,
            then : null,
            otherwise: Yup.string()
            .required("User Name is Required")
            .min(4, "At Least 4 character")
            .max(100, "At Most 100 character")
            .matches(/^[a-zA-Z0-9]{4,100}$/, "Only Letters and Numbers Allowed")
            .when('usernamestatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-username', "User Name Is Exist", ()=>false),
                otherwise: null,
            }),
        }),

        email: Yup.mixed().when('editmode', {
            is : (value) => value,
            then : null,
            otherwise: Yup.string()
            .required("Email Is Required")
            .email("Email Not Correct")
            .when('emailstatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-email', "Email Is Exist", ()=>false),
                otherwise: null,
            }),
        }),

        password: Yup.mixed().when('editmode', {
            is : (value) => value,
            then : null,
            otherwise: Yup.string()
            .required("Password is Required")
            .min(6, "At Least 6 character")
            .matches(/(?=.*?[A-Za-z])/, "At Leact One Letter")
            .matches(/(?=.*?[0-9])/, "At Leact One Number")
            .matches(/(?=.*?[#?!@$_%^&*-])/, "At Leact One Special Character")
        }),

        password_confirmation: Yup.mixed().when('editmode', {
            is : (value) => value,
            then : null,
            otherwise: Yup.string()
            .required("Password Confirmation is Required")
            .test('check-password-confirmation', "Passwords Not Match", function(value) {
                return this.parent.password === value;
            })
        }),

        status: Yup.number()
        .typeError("Please Select Status Of User")
        .required("Please Select Status Of User")
        .min(1, "Please Select Status Of User")
        .integer("Please Select Status Of User"),

        note: Yup.string()
        .min(4, "At Least 4 Character")
        .max(1000, "At Most 1000 Character"),
    });

    let defaultInitialValues = {
        editmode: props.savedItem ? true : false,
        nationalidstatus:true,
        passportnumstatus:true,
        usernamestatus: true,
        emailstatus: true,
        firstname : props.savedItem ? props.savedItem.firstname : '',
        middlename : props.savedItem ? (props.savedItem.middlename ? props.savedItem.middlename : '' ) : '',
        lastname : props.savedItem ? props.savedItem.lastname : '',
        gender : props.savedItem ? props.savedItem.gender : '',
        birthdate : props.savedItem ? props.savedItem.birthdate : null,
        country : props.savedItem ? props.savedItem.country : null,
        city: props.savedItem ? props.savedItem.city : null,
        address: props.savedItem ? props.savedItem.address : '',
        nationalid: props.savedItem ? props.savedItem.nationalid : '',
        passportnum: props.savedItem ? (props.savedItem.passportnum ? props.savedItem.passportnum : '') : '',
        username: props.savedItem ? props.savedItem.username : '',
        email: props.savedItem ? props.savedItem.email : '',
        password: '',
        password_confirmation: '',
        note: props.savedItem ? (props.savedItem.note ?  props.savedItem.note : '') : '',
        status: (props.savedItem && props.userStatusOptions) ? props.savedItem.status : '',
        visible: props.savedItem ? props.savedItem.visible : 'hidden',
    }

    let defaultFormState = {
        initialValues: defaultInitialValues,
        enableReinitialize: true,
        validationSchema: validationObject,
        
        onSubmit: (values)=>{
            values.created_by = 1;
            values.birthdate = format(new Date(values.birthdate), 'yyyy-MM-dd');
            values = prepareValuesBeforeSend(values, countryISO, CONFIG.DEFAULT_COUNTRY);

            (props.userId || props.savedItem) 
            ? updateToDb(values) 
            : addToDb(values);
            
        }
    };

    const formik = useFormik(defaultFormState);
    const[editFormValue, setEditFormValue] = useState({
        'nationalid': '',
        'passportnum': '',
        'username': '',
        'email': ''
    });
    useEffect(()=>{
        if(props.userId && props.savedItem) {
            setEditFormValue({
                'nationalid': props.savedItem['nationalid'],
                'passportnum': props.savedItem['passportnum'],
                'username': props.savedItem['username'],
                'email': props.savedItem['email'],
            });     
        }
    }, [props.userId, props.savedItem]);
    /***********************************
     * Formik For User Name On Edit Mode
     ***********************************/
    const[editModeUserName, setEditModeUserName] = useState(false);

    let defaultInitialValuesUserName = {
        editmode: editModeUserName,
        username: '',
        usernamestatus: true,
    }

    let validationObjectUserName = Yup.object({
        editmode: Yup.boolean(),
        usernamestatus: Yup.boolean(),
        username: Yup.mixed().when('editmode', {
            is : (value) => value === true,
            then : Yup.string()
            .required("User Name is Required")
            .min(4, "At Least 4 character")
            .max(100, "At Most 100 character")
            .matches(/^[a-zA-Z0-9]{4,100}$/, "Only Letters and Numbers Allowed")
            .when('usernamestatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-username', "User Name Is Exist", ()=>false),
                otherwise: null,
            }),
            otherwise: null
        })
    });

    let defaultFormStateUserName = {
        initialValues: defaultInitialValuesUserName,
        validateOnChange:true,
        validationSchema: validationObjectUserName,

        onSubmit:(values) => {
            props.actions.setOpenLoading(true);
            axios.put(`api/v1/users/${props.savedItem.id}/username`, values)
            .then(()=>{
                formikUserName.setFieldValue('editmode', false);
                setEditModeUserName(false);
                props.actions.handleAssignSavedItem({...props.savedItem, username: values.username});
                props.actions.setAlertObj({
                    open: true,
                    type: 'success',
                    message: 'Successfully Edit User Name'
                });
            })
            .catch(()=>{
                props.actions.setAlertObj({
                    open: true,
                    type: 'error',
                    message: 'Failed Edit User Name'
                });
            })
            .finally(()=>{
                props.actions.setOpenLoading(false);
            });
        }
    };

    const formikUserName = useFormik(defaultFormStateUserName);

    /*******************************
     * Formik For Email On Edit Mode
     *******************************/
    const[editModeEmail, setEditModeEmail] = useState(false);

    let defaultInitialValuesEmail = {
        editmode: editModeEmail,
        email: '',
        emailstatus: true,
    }

    let validationObjectEmail= Yup.object({
        // editmode: Yup.boolean(),
        // emailstatus: Yup.boolean(),
        email: Yup.mixed().when('editmode', {
            is : (value) => value === true,
            then : Yup.string()
            .required("Email Is Required")
            .email("Email Not Correct")
            .when('emailstatus', {
                is: (value)=>!value===true,
                then: Yup.string().test('check-unique-email', "Email Is Exist", ()=>false),
                otherwise: null,
            }),
            otherwise: null
        })
    });

    let defaultFormStateEmail = {
        initialValues: defaultInitialValuesEmail,
        validateOnChange:true,
        validationSchema: validationObjectEmail,

        onSubmit:(values) => {
            props.actions.setOpenLoading(true);
            axios.put(`api/v1/users/${props.savedItem.id}/email`, values)
            .then(()=>{
                formikEmail.setFieldValue('editmode', false);
                setEditModeEmail(false);
                props.actions.handleAssignSavedItem({...props.savedItem, email: values.email});
                props.actions.setAlertObj({
                    open: true,
                    type: 'success',
                    message: 'Successfully Edit Email'
                });
            })
            .catch(()=>{
                props.actions.setAlertObj({
                    open: true,
                    type: 'error',
                    message: 'Failed Edit Email'
                });
            })
            .finally(()=>{
                props.actions.setOpenLoading(false);
            });
        }
    };

    const formikEmail = useFormik(defaultFormStateEmail);

    /**********************************
     * Formik For Password On Edit Mode
     **********************************/
     const[editModePassword, setEditModePassword] = useState(false);

     let defaultInitialValuesPassword = {
         editmode: editModePassword,
         password: '',
         password_confirmation: ''
     }
 
     let validationObjectPassword= Yup.object({
        //  editmode: Yup.boolean(),
         password: Yup.mixed().when('editmode', {
             is : (value) => value === true,
             then : Yup.string()
             .required("Password is Required")
             .min(6, "At Least 6 character")
             .matches(/(?=.*?[A-Za-z])/, "At Leact One Letter")
             .matches(/(?=.*?[0-9])/, "At Leact One Number")
             .matches(/(?=.*?[#?!@$_%^&*-])/, "At Leact One Special Character"),
             otherwise: null,
        }),
        password_confirmation: Yup.mixed().when('editmode', {
            is : (value) => value === true,
            then : Yup.string()
            .required("Password Confirmation is Required")
            .test('check-password-confirmation', "Passwords Not Match", function(value) {
                return this.parent.password === value;
            }),
            otherwise: null,
         }),
    });
 
    let defaultFormStatePassword = {
         initialValues: defaultInitialValuesPassword,
         validateOnChange:true,
         validationSchema: validationObjectPassword,
 
         onSubmit:(values) => {
             props.actions.setOpenLoading(true);
            axios.put(`api/v1/users/${props.savedItem.id}/password`, values)
            .then(()=>{
                formikPassword.setFieldValue('editmode', false);
                setEditModePassword(false);
                formikPassword.setFieldValue('password', '');
                formikPassword.setFieldTouched('password', false);
                formikPassword.setFieldValue('password_confirmation', '');
                formikPassword.setFieldTouched('password_confirmation', false);
                props.actions.setAlertObj({
                    open: true,
                    type: 'success',
                    message: 'Successfully Edit Password'
                });
            })
            .catch(()=>{
                props.actions.setAlertObj({
                    open: true,
                    type: 'error',
                    message: 'Failed Edit Password'
                });
            })
            .finally(()=>{
                props.actions.setOpenLoading(false);
            });
         }
    };
 
     const formikPassword = useFormik(defaultFormStatePassword);

    /****************************************************
     * Initalize Value on username and email on Edit Mode
     ****************************************************/
    useEffect(()=>{
        if(props.userId && props.savedItem) {
            formikUserName.setFieldValue('username', props.savedItem.username);
            formikEmail.setFieldValue('email', props.savedItem.email);
        }
    }, [props.userId, props.savedItem]);

    /**************************************************************
     * Control Action For username, email and password on Edit Mode
     **************************************************************/
    function handleEdit(formik, editModeAction) {
        formik.setFieldValue('editmode', true);
        editModeAction(true);
    }

    function handleSave(formik, editModeStatus, editModeAction, fieldName) {
        if (editModeStatus){
            if(formik.values[fieldName] === editFormValue[fieldName]) {
                props.actions.setAlertObj({
                    open: true,
                    type: 'warning',
                    message: 'Value Not Edit'
                });
                return;
            }

            if(Object.keys(formik.errors).length === 0) {
                formik.submitForm();
            }
        }
    }

    function handleReset(formik, editModeAction, fieldName) {
        if(Array.isArray(fieldName)) {
            for(let index in fieldName){
                formik.setFieldValue(`${fieldName[index]}`, props.savedItem[fieldName[index]] || '');
                formik.setFieldTouched(`${fieldName[index]}`, false);
            }
        }
        else {
            formik.setFieldValue(`${fieldName}`, props.savedItem[fieldName] || '');
            formik.setFieldTouched(`${fieldName}`, false);
        }
        formik.setFieldValue('editmode', false);
        editModeAction(false);
    }

    /*************************
     * Handle Birth Date Field
     *************************/
    function handeBirthDateChange(value) {
        formik.setFieldValue('birthdate', value);     
    }

    // initialze Birth Date when Add/Edit User
    useEffect(()=>{
        const birthDateValue = props.savedItem ? props.savedItem.birthdate : null;
        formik.setFieldValue('birthdate', birthDateValue);
    }, [props.savedItem]);


    /*************************
     * Handle Gender Field
     *************************/
    function handeGenderChange(event) {
        formik.setFieldValue('gender', event.target.value);   
    }
    // initialze Gender when Add/Edit User
    useEffect(()=>{
        const genderValue = props.savedItem ? props.savedItem.gender : '';
        formik.setFieldValue('gender', genderValue);
    }, [ props.savedItem]);

    /*************************
     * Handle Country Field
     *************************/
    const[countryISO, setCountryISO] = useState(null);
    function handeCountryChange(event, option) {
        const value = option ? option.id : null;
        const iso = option ? option.iso : null;
        setCountryISO(iso);
        formik.setFieldValue('country', value); 
        setTimeout(()=>{
            formik.validateField('country');
        });   
    }
    // initialze Country when Add/Edit User
    useEffect(()=>{
            const country = props.savedItem ? props.savedItem.country : null;
            formik.setFieldValue('country', country);
    }, [ props.savedItem]);

    // initialze Country ISO to control dis/appear city, passport number fields when Add/Edit User
    useEffect(()=>{
        if(formik.values.country) {
            const countryObject = props.countriesOptions ? props.countriesOptions.find((option)=>+(option.id) === +(formik.values.country)) : null;
            (countryObject) ? setCountryISO(countryObject.iso) : setCountryISO(null);
        }
        else {
            setCountryISO(null)
        }
    }, [props.countriesOptions, formik.values.country]);

    /*************************
     * Handle City Field
     *************************/
     function handeCityChange(event, option) {
        const value = option ? option.id : null;
         formik.setFieldValue('city', value);       
         setTimeout(()=>{formik.validateField('city')});   
     }
     // initialze City when Add/Edit User
     useEffect(()=>{
         let cityValue = props.savedItem ? props.savedItem.city : null;
         formik.setFieldValue('city', cityValue);
     }, [ props.savedItem]);

    /*************************
     * Handle visible Field
     *************************/
    function handeChange(e) {
        const visibleValue = e.target.checked ? 'visible' : 'hidden';
        formik.setFieldValue('visible', visibleValue);        
    }
    // initialze Visible when Add/Edit User
    useEffect(()=>{
        const checkedValue = props.savedItem ? props.savedItem.visible : 'hidden';
        formik.setFieldValue('visible', checkedValue);
    }, [props.savedItem]);
      
    return ( 
        <>
        <form onSubmit={formik.handleSubmit}>
            <input type="hidden" name="editmode" {...formik.getFieldProps('editmode')}/>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="firstname" >First Name</FormLabel>
                    </div>
                    <div className="field-form">
                        <TextField
                            size="small"
                            name="firstname"
                            fullWidth
                            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                            {...formik.getFieldProps('firstname')}/>
                        <FormFieldError name="firstname" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="middlename" >Middle Name</FormLabel>
                    </div>
                    <div className="field-form">
                        <TextField
                            fullWidth
                            size="small"
                            name="middlename"
                            error={formik.touched.middlename && Boolean(formik.errors.middlename)}
                            {...formik.getFieldProps('middlename')}/>
                        <FormFieldError name="middlename" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="lastname" >Last Name</FormLabel>
                    </div>
                    <div className="field-form">
                        <TextField
                            size="small"
                            name="lastname"
                            fullWidth
                            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                            {...formik.getFieldProps('lastname')}/>
                        <FormFieldError name="lastname" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="gender">Gender</FormLabel>
                    </div>
                    <div className="field-form">
                         <RadioGroup row value={formik.values.gender} aria-label="gender" name="gender" onChange={handeGenderChange}>
                            <FormControlLabel value="male" label="Male" control={<Radio size='small' />} />
                            <FormControlLabel value="female" label="Female" control={<Radio size='small' />} />
                        </RadioGroup>
                        <FormFieldError name="gender" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="birthdate">Date Of Birth</FormLabel>
                    </div>                
                    <div className="field-form">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            maxDate={new Date()}
                            views={['year', 'month', 'day']}
                            openTo="year"
                            value={formik.values.birthdate ? new Date(formik.values.birthdate) : null}
                            onChange={handeBirthDateChange}
                            inputFormat={"dd/MM/yyyy"}
                            renderInput={(params) => <TextField 
                                {...params} 
                                size='small' 
                                fullWidth 
                                error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                                />} 
                        />
                    </LocalizationProvider>
                    <FormFieldError name="birthdate" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <Divider color={"#D3D3D3"} sx={{mb:2, height: '1px'}} />

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="county" >Country</FormLabel>
                    </div>
                    <div className="field-form">
                        <Autocomplete
                            size='small'
                            name='country'
                            value={ (props.countriesOptions) ? (props.countriesOptions.find((option) => +(option.id) === +(formik.values.country)) || null) : null}
                            getOptionLabel={(option)=>option.nicename}
                            options={props.countriesOptions || []}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange = {handeCountryChange}
                            renderInput={(params) => <TextField 
                                error={formik.touched.country && Boolean(formik.errors.country)}
                                size='small' {...params} />}
                            />
                        <FormFieldError name="country" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            {
            (countryISO === CONFIG.DEFAULT_COUNTRY)
            &&
            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="city">City</FormLabel>
                    </div>
                    <div className="field-form">
                        <Autocomplete
                            size='small'
                            name="city"
                            value={ (props.citiesOptions) ? (props.citiesOptions.find((option) => +option.id === +(formik.values.city)) || null) : null }
                            getOptionLabel={(option)=>option.name}
                            options={props.citiesOptions || []}
                            isOptionEqualToValue={(option, value)=> option.id === value.id}
                            onChange = {handeCityChange}
                            renderInput={(params) => <TextField 
                                error={formik.touched.city && Boolean(formik.errors.city)}
                                size='small'
                                {...params} />}
                        />
                        <FormFieldError name="city" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>
            }

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="address">Address</FormLabel>
                    </div>
                    <div className="field-form">
                        <TextField
                            fullWidth
                            size="small"
                            id='address'
                            name='address'
                            multiline
                            minRows={3}
                            maxRows={7}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            {...formik.getFieldProps('address')}/>
                        <FormFieldError name="address" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <Divider color={"#D3D3D3"} sx={{mb:2, height: '1px'}} />

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="nationalid">National ID</FormLabel>
                    </div>
                    <div className="field-form">
                         <TextField
                            fullWidth
                            size="small"
                            name="nationalid"
                            value={formik.values.nationalid}
                            error={formik.touched.nationalid && Boolean(formik.errors.nationalid)}
                            onChange={function(e){
                                let value = e.target.value;
                                formik.setFieldValue('nationalid', value);
                                formik.setFieldTouched('nationalid', true);
                                if(value !== undefined &&  value.length === 14) {
                                    (props.savedItem && value === editFormValue['nationalid'])
                                    ? formik.setFieldValue('nationalidstatus', true)
                                    : checkUniquNationalId(formik, 'nationalid', value, 'nationalidstatus');
                                }
                            }}/>
                        <FormFieldError name="nationalid" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            {
                (countryISO && countryISO !== CONFIG.DEFAULT_COUNTRY)
                &&
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel  htmlFor="passportnum">Passport Num</FormLabel> 
                        </div>
                        <div className="field-form">
                            <TextField
                                fullWidth
                                size="small"
                                name="passportnum"
                                value={formik.values.passportnum}
                                error={formik.touched.passportnum && Boolean(formik.errors.passportnum)}
                                onChange={function(e){
                                    let value = e.target.value;
                                    formik.setFieldValue('passportnum', value);
                                    formik.setFieldTouched('passportnum', true);
                                    if(value !== undefined &&  value.length === 14) {
                                        (props.savedItem && value === editFormValue['passportnum'])
                                        ? formik.setFieldValue('passportnumstatus', true)
                                        : checkUniquPassportNum(formik, 'passportnum', value, 'passportnumstatus');
                                    }
                                }}/>
                            <FormFieldError name="passportnum" formik={formik}/>
                        </div>
                    </div>
                    <div className='unit-form'></div>
                </div>
            }

            <Divider color={"#D3D3D3"} sx={{mb:2, height: '1px'}} />

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="username" >User Name</FormLabel>
                    </div>
                    <div className="field-form">
                        {
                            (props.userId)
                            ?
                                <>
                                    <TextField
                                    size="small"
                                    name="username"
                                    fullWidth
                                    value={formikUserName.values.username}
                                    disabled = {(props.userId) && !editModeUserName}
                                    error={formikUserName.touched.username && Boolean(formikUserName.errors.username)}
                                    onChange={function(e){
                                        let value = e.target.value;
                                        formikUserName.setFieldValue('username', value);
                                        formikUserName.setFieldTouched('username', true);
                                        if(value !== undefined && value.length >=4 && value.length <= 225) {
                                            (props.savedItem && value === editFormValue['username'])
                                            ? formikUserName.setFieldValue('usernamestatus', true)
                                            : checkUniquUserName(formikUserName, 'username', value, 'usernamestatus');
                                        }
                                    }}/>
                                    {
                                        editModeUserName
                                        ?
                                        <div className='inline-container-action'>
                                            <div className='double'>
                                                <InlineButton 
                                                disabled={formikUserName.values.username === editFormValue['username']} 
                                                color="success" 
                                                action={()=>handleSave(formikUserName, editModeUserName, setEditModeUserName, 'username')}>
                                                    <CheckIcon size="small" />
                                                </InlineButton>
                                                <InlineButton 
                                                color="error" 
                                                action={()=>handleReset(formikUserName, setEditModeUserName, 'username')}>
                                                    <CloseIcon size="small" />
                                                </InlineButton>

                                                <FormFieldError name="username" formik={formikUserName}/>
                                            </div>
                                        </div>          
                                        :
                                        <div className='inline-container-action'>
                                            <div className='single'>
                                                <InlineButton  color="primary" action={()=>handleEdit(formikUserName, setEditModeUserName)}>
                                                    <EditIcon size="small" />
                                                </InlineButton>
                                            </div>
                                        </div>
                                    }
                                </>
                                :
                                <>
                                    <TextField
                                    size="small"
                                    name="username"
                                    value={formik.values.username}
                                    fullWidth
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    onChange={function(e){
                                        let value = e.target.value;
                                        formik.setFieldValue('username', value);
                                        formik.setFieldTouched('username', true);
                                        if(value !== undefined && value.length >=4 && value.length <= 225) {
                                            (props.savedItem && value === editFormValue['username'])
                                            ? formik.setFieldValue('usernamestatus', true)
                                            : checkUniquUserName(formik, 'username', value, 'usernamestatus');
                                        }
                                    }}/>

                                    <FormFieldError name="username" formik={formik}/>
                                </>
                            }
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="email" >Email</FormLabel>
                    </div>
                    <div className="field-form">
                        {
                            (props.userId)
                            ?
                            <>
                                <TextField
                                size="small"
                                name="email"
                                value={formikEmail.values.email}
                                fullWidth
                                disabled = {(props.userId) && !editModeEmail}
                                error={formikEmail.touched.email && Boolean(formikEmail.errors.email)}
                                onChange={function(e){
                                    let value = e.target.value;
                                    formikEmail.setFieldValue('email', value);
                                    formikEmail.setFieldTouched('email', true);
                                    if(value !== undefined && value.length >=4 && value.length <= 225) {
                                        (props.savedItem && value === editFormValue['email'])
                                        ? formikEmail.setFieldValue('emailstatus', true)
                                        : checkUniquEmail(formikEmail, 'email', value, 'emailstatus');
                                    }
                                }}/>
                                {
                                    editModeEmail
                                    ?
                                    <div className='inline-container-action'>
                                        <div className='double'>
                                            <InlineButton disabled={formikEmail.values.email === editFormValue['email']} color="success" action={()=>handleSave(formikEmail, editModeEmail, setEditModeEmail, 'email')}>
                                                <CheckIcon size="small" />
                                            </InlineButton>
                                            <InlineButton color="error" action={()=>handleReset(formikEmail, setEditModeEmail, 'email')}>
                                                <CloseIcon size="small" />
                                            </InlineButton>

                                            <FormFieldError name="email" formik={formikEmail}/>
                                        </div>
                                    </div>                                       
                                    :
                                    <div className='inline-container-action'>
                                        <div className='single'>
                                            <InlineButton color="primary" action={()=>handleEdit(formikEmail, setEditModeEmail)}>
                                                <EditIcon size="small" />
                                            </InlineButton>
                                        </div>
                                    </div>
                                }
                            </>
                            :
                            <>
                                <TextField
                                size="small"
                                name="email"
                                value={formik.values.email}
                                fullWidth
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                onChange={function(e){
                                    let value = e.target.value;
                                    formik.setFieldValue('email', value);
                                    formik.setFieldTouched('email', true);
                                    if(value !== undefined && value.length >=4 && value.length <= 225) {
                                        (props.savedItem && value === editFormValue['email'])
                                        ? formik.setFieldValue('emailstatus', true)
                                        : checkUniquEmail(formik, 'email', value, 'emailstatus');
                                    }
                                }}/>

                                <FormFieldError name="email" formik={formik}/>
                            </>
                        }
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="email" >Password</FormLabel>
                    </div>
                    <div className="field-form">
                        {
                            (props.userId)
                            ?
                            <>
                                <TextField
                                size="small"
                                type="password"
                                name="password"
                                fullWidth
                                disabled = {!editModePassword}
                                error={formikPassword.touched.password && Boolean(formikPassword.errors.password)}
                                {...formikPassword.getFieldProps('password')}/>
                                {
                                    editModePassword
                                    ?
                                    <div className='inline-container-action'>
                                        <div className='double'>
                                            <InlineButton color="success" action={()=>handleSave(formikPassword, editModePassword, setEditModePassword, 'password')}>
                                                <CheckIcon size="small" />
                                            </InlineButton>
                                            <InlineButton color="error" action={()=>handleReset(formikPassword, setEditModePassword, ['password', 'password_confirmation'])}>
                                                <CloseIcon size="small" />
                                            </InlineButton>

                                            <FormFieldError name="password" formik={formikPassword}/>
                                        </div> 
                                    </div> 
                                    :
                                    <div className='inline-container-action'>
                                        <div className='single'>
                                            <InlineButton color="primary" action={()=>handleEdit(formikPassword, setEditModePassword)}>
                                                <EditIcon size="small" />
                                            </InlineButton>
                                        </div> 
                                    </div>
                                }
                            </>
                            :
                            <>
                                <TextField
                                size="small"
                                type="password"
                                name="password"
                                fullWidth
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                {...formik.getFieldProps('password')}/>

                                <FormFieldError name="password" formik={formik}/>
                            </>
                        }
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            {
                (editModePassword || !props.userId)
                &&
                <div className='row-form'>
                    <div className='unit-form'>
                        <div className="label-form">
                            <FormLabel htmlFor="password_confirmation" >Retype Password</FormLabel>
                        </div>
                        <div className="field-form">
                            {
                                (props.userId)
                                ?
                                <>
                                    <TextField
                                    size="small"
                                    type={"password"}
                                    name="password_confirmation"
                                    fullWidth 
                                    error={formikPassword.touched.password_confirmation && Boolean(formikPassword.errors.password_confirmation)}
                                    {...formikPassword.getFieldProps('password_confirmation')}/>

                                    <FormFieldError name="password_confirmation" formik={formikPassword}/>
                                </>
                                :
                                <>
                                    <TextField
                                    size="small"
                                    type={"password"}
                                    name="password_confirmation"
                                    fullWidth
                                    error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
                                    {...formik.getFieldProps('password_confirmation')}/>

                                    <FormFieldError name="password_confirmation" formik={formik}/>
                                </>
                            }
                        </div>
                    </div>
                    <div className='unit-form'></div>
                </div>
            }

            <Divider color={"#D3D3D3"} sx={{mb:2, height: '1px'}} />

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="type" >Status</FormLabel>
                    </div>               
                    <div className="field-form">
                    <Select 
                        size="small"
                        name="status" 
                        fullWidth
                        displayEmpty
                        error={formik.touched.status && Boolean(formik.errors.status)}
                        {...formik.getFieldProps("status")}>
                            <MenuItem  value="">
                                <em>None</em>
                            </MenuItem>
                                {
                                    props.userStatusOptions
                                    &&
                                    props.userStatusOptions.map((item)=>{
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>  
                                    })
                                }
                        </Select>
                        <FormFieldError name="status" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel htmlFor="note">Note</FormLabel>
                    </div>                
                    <div className="field-form">
                        <TextField
                            fullWidth
                            size="small"
                            id='note'
                            name='note'
                            multiline
                            minRows={3}
                            maxRows={7}
                            error={formik.touched.note && Boolean(formik.errors.note)}
                            {...formik.getFieldProps('note')}/>
                        <FormFieldError name="note" formik={formik}/>
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <div className='row-form'>
                <div className='unit-form'>
                    <div className="label-form">
                        <FormLabel  htmlFor="visible" >Visible</FormLabel>
                    </div>               
                    <div className="field-form">
                        <Checkbox 
                            sx={{marginLeft:"-10px"}}
                            name='visible'
                            checked={(formik.values.visible) === 'visible' ? true : false}
                            onChange={handeChange}
                            />
                    </div>
                </div>
                <div className='unit-form'></div>
            </div>

            <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                {
                (props.userId) 
                ?
                <Button className="big-button" variant="contained" color="primary" type="submit">
                    Edit
                    <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                    <EditIcon />
                </Button>
                :
                <Button className="big-button" variant="contained" color="success" type="submit">
                    Add New
                    <Divider orientation="vertical" color="#fff" light sx={{mx:1}}/>
                    <AddIcon />
                </Button>
            }
            </Box>  
        </form>
         </>
    );
}