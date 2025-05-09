import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function getPaymentMethods() {
    const res = await axios.get(`${api}/payment-methods`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function syncPaymentMethods() {
    const res = await axios.post(`${api}/payment-methods/sync`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 