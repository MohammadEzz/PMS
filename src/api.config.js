import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:9984';


export async function getCSRFToken() {
    await axios.get('sanctum/csrf-cookie');
}


