import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function getProjects() {
    const res = await axios.get(`${api}/projects`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function syncProjects() {
    const res = await axios.post(`${api}/projects/sync`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 