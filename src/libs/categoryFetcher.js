import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function fetchExpenseCategories() {
    const res = await axios.get(`${api}/expense-categories`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseCategoryById(id) {
    const res = await axios.get(`${api}/expense-categories/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function createExpenseCategory(data) {
    const res = await axios.post(`${api}/expense-categories`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updateExpenseCategory(id, data) {
    const res = await axios.put(`${api}/expense-categories/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function deleteExpenseCategory(id) {
    const res = await axios.delete(`${api}/expense-categories/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 