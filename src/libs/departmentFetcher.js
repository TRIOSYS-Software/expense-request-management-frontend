import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function fetchDeparments() {
    const res = await axios.get(`${api}/departments`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function createDepartment(data) {
    const res = await axios.post(`${api}/departments`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updateDepartment(id, data) {
    const res = await axios.put(`${api}/departments/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function deleteDepartment(id) {
    const res = await axios.delete(`${api}/departments/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 