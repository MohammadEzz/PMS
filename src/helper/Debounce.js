export function debounceCheckUniqueValue(callback, wait) {
    let timeout;
    return (formikObj, field, value, fieldValueStatus)=>{
        clearTimeout(timeout);
        timeout = setTimeout(callback, wait, formikObj, field, value, fieldValueStatus);
    }
}

