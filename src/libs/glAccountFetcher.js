import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function getGLAccounts() {
    const res = await axios.get(`${api}/gl-acc`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function syncGLAccounts() {
    const res = await axios.post(`${api}/gl-acc/sync`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 