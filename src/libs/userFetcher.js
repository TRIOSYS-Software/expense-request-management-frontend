import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function fetchUsers() {
    const res = await axios.get(`${api}/users`, {
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

export async function fetchUserById(id) {
    const res = await axios.get(`${api}/users/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchUsersByRole(role) {
    const res = await axios.get(`${api}/users/role/${role}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

// Alias for fetchUsersByRole to maintain backward compatibility
export const getUsers = fetchUsersByRole;

export async function createUser(data) {
    const res = await axios.post(`${api}/users`, data, {
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

export async function deleteUser(id) {
    const res = await axios.delete(`${api}/users/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function changePassword(id, data) {
    const res = await axios.put(`${api}/users/${id}/change-password`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

// User Payment Methods
export async function getUsersWithPaymentMethods() {
    const res = await axios.get(`${api}/users/payment-methods`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function setUserPaymentMethod(data) {
    const res = await axios.post(`${api}/users/set-payment-methods`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUserPaymentMethods(id) {
    const res = await axios.get(`${api}/users/${id}/payment-methods`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

// User GL Accounts
export async function setUserGLAccounts(data) {
    const res = await axios.post(`${api}/users/set-gl-accounts`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUserGLAccounts(id) {
    const res = await axios.get(`${api}/users/${id}/gl-accounts`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUsersWithGLAccounts() {
    const res = await axios.get(`${api}/users/gl-accounts`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

// User Projects
export async function setUserProjects(data) {
    const res = await axios.post(`${api}/users/set-projects`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUserProjects(id) {
    const res = await axios.get(`${api}/users/${id}/projects`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUsersWithProjects() {
    const res = await axios.get(`${api}/users/projects`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 