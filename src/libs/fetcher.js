import { getToken, encrypt } from "../utility/generate_token";
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

export async function changePassword(id, data) {
    const res = await axios.put(`${api}/users/${id}/change-password`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getProjects(){
    const res = await axios.get(`${api}/projects`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function syncProjects(){
    const res = await axios.post(`${api}/projects/sync`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getPaymentMethods(){
    const res = await axios.get(`${api}/payment-methods`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function syncPaymentMethods(){
    const res = await axios.post(`${api}/payment-methods/sync`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getGLAccounts(){
    const res = await axios.get(`${api}/gl-acc`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function syncGLAccounts(){
    const res = await axios.post(`${api}/gl-acc/sync`, null, {
        headers: {
            'Authorization': `${getToken()}`
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

export async function sendtoSQLACC(id){
    const res = await axios.post(`${api}/expense-requests/${id}/send-to-sqlacc`, null, {
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
    return res.data;
}

export async function getUsersWithPaymentMethods(){
    const res = await axios.get(`${api}/users/payment-methods`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function setUserPaymentMethod(data){
    const res = await axios.post(`${api}/users/set-payment-methods`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUserPaymentMethods(id){
    const res = await axios.get(`${api}/users/${id}/payment-methods`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function setUserGLAccounts(data){
    const res = await axios.post(`${api}/users/set-gl-accounts`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUserGLAccounts(id){
    const res = await axios.get(`${api}/users/${id}/gl-accounts`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function getUsersWithGLAccounts(){
    const res = await axios.get(`${api}/users/gl-accounts`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}