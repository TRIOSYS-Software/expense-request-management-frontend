import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function postLogin(email, password) {
    const res = await axios.post(`${api}/login`, {
        email,
        password
    });
    if (res.status === 200) {
        return res.data;
    }
    throw new Error("Incorrect Username or Password");
}

export async function fetchVerify() {
    const res = await axios.post(`${api}/verify`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function forgotPassword(data) {
    const res = await axios.post(`${api}/forgot-password`, data);
    return res.data;
}

export async function validatePasswordResetToken(data) {
    const res = await axios.post(`${api}/validate-reset-token`, data);
    return res.data;
}

export async function resetPassword(data) {
    const res = await axios.post(`${api}/reset-password`, data);
    return res.data;
} 