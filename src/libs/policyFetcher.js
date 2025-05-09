import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function fetchPolicies() {
    const res = await axios.get(`${api}/approval-policies`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchPolicyById(id) {
    const res = await axios.get(`${api}/approval-policies/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function createPolicy(data) {
    const res = await axios.post(`${api}/approval-policies`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updatePolicy(id, data) {
    const res = await axios.put(`${api}/approval-policies/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function deletePolicy(id) {
    const res = await axios.delete(`${api}/approval-policies/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 