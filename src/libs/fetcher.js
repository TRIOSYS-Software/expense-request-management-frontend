import { getToken, encrypt } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;
const sqlAccApi = import.meta.env.VITE_SQL_ACC_API;
const key = import.meta.env.VITE_KEY;
const secret = import.meta.env.VITE_SECRET;

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

export async function fetchUsersByRole(role) {
    const res = await axios.get(`${api}/users/role/${role}`, {
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

export async function getPaymentMethods(){
    const encryptedKey = await encrypt(secret, key);
    const res = await axios.get(`${sqlAccApi}/payment-methods`, {
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

export async function fetchPolicyById(id) {
    const res = await axios.get(`${api}/approval-policies/${id}`, {
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

export async function updatePolicy(id, data){
    const res = await axios.put(`${api}/approval-policies/${id}`, data, {
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

export async function createExpense(data){
    const res = await axios.post(`${api}/expense-requests`, data, {
        headers: {
            'Authorization': `${getToken()}`,
            "Content-Type": 'multipart/form-data',
        }
    });
    return res.data;
}

export async function updateExpense(id, data){
    const res = await axios.put(`${api}/expense-requests/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequests(){
    const res = await axios.get(`${api}/expense-requests`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequestsByID(id){
    const res = await axios.get(`${api}/expense-requests/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequestsSummary(params, user){
    if (user.role === 3){
        params.user_id = user.id;
    }
    if (user.role === 2) {
        params.approver_id = user.id;
    }
    const res = await axios.get(`${api}/expense-requests/summary`, {
        headers: {
            'Authorization': `${getToken()}`
        },
        params
    });
    return res.data;
}

export async function fetchExpenseRequestsByApproverID(id){
    const res = await axios.get(`${api}/expense-requests/approver/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequestsByUserID(id){
    const res = await axios.get(`${api}/expense-requests/user/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function sendtoSQLACC(data){
    const res = await axios.post(`${api}/expense-requests/send-to-sqlacc`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function deleteExpenseRequest(id){
    const res = await axios.delete(`${api}/expense-requests/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseAttachment(file){
    const res = await axios.get(`${api}/expense-requests/attachment/${file}`, {
        headers: {
            'Authorization': `${getToken()}`
        },
        responseType: 'blob'
    });
    return res.data;
}

export async function fetchExpenseApprovalsByApproverID(id){
    const res = await axios.get(`${api}/expense-approvals/approver/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updateExpenseApprovals(id, data){
    const res = await axios.put(`${api}/expense-approvals/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
}

export async function getLowLevelGLAccounts(){
    const res = await axios.get(`${sqlAccApi}/gl-accounts/low-level`, {
        headers: {
            'ShweTaik': `${secret}`
        }
    });
    return res.data;
}