import { getToken, encrypt } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;
const sqlAccApi = import.meta.env.VITE_SQL_ACC_API;
const key = import.meta.env.VITE_KEY;
const secret = import.meta.env.VITE_SECRET;

export async function fetchExpenseCategories() {
    const res = await axios.get(`${api}/expense-categories`);
    return res.data;
}

export async function fetchUsers() {
    const res = await axios.get(`${api}/users`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchUserById(id) {
    const res = await axios.get(`${api}/users/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updateUser(id, data) {
    const res = await axios.put(`${api}/users/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchRoles() {
    const res = await axios.get(`${api}/roles`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchDeparments() {
    const res = await axios.get(`${api}/departments`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function createUser(data) {
    const res = await axios.post(`${api}/users`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function postLogin(email, password){
    const res = await axios.post(`${api}/login`, {
        email,
        password
    });
    if (res.status === 200) {
        return res.data;
    }
    throw new Error("Incorrect Username or Password");
}

export async function fetchVerify(){
    const res = await axios.post(`${api}/verify`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getProjects(){
    const encryptedKey = await encrypt(secret, key);
    const res = await axios.get(`${sqlAccApi}/projects`, {
        headers: {
            'ShweTaik': `${encryptedKey}`
        }
    });
    return res.data;
}

export async function fetchPolicies() {
    const res = await axios.get(`${api}/approval-policies`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function createPolicy(data){
    const res = await axios.post(`${api}/approval-policies`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function deletePolicy(id){
    const res = await axios.delete(`${api}/approval-policies/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}