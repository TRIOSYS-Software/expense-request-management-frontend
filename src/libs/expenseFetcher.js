import { getToken } from "../utility/generate_token";
import axios from "axios";

const api = import.meta.env.VITE_API;

export async function createExpense(data) {
    const res = await axios.post(`${api}/expense-requests`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updateExpense(id, data) {
    const res = await axios.put(`${api}/expense-requests/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequests() {
    const res = await axios.get(`${api}/expense-requests`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequestsByID(id) {
    const res = await axios.get(`${api}/expense-requests/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequestsSummary(params, user) {
    if (user.role === 3) {
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

export async function fetchExpenseRequestsByApproverID(id) {
    const res = await axios.get(`${api}/expense-requests/approver/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseRequestsByUserID(id) {
    const res = await axios.get(`${api}/expense-requests/user/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function sendtoSQLACC(id) {
    const res = await axios.post(`${api}/expense-requests/${id}/send-to-sqlacc`, null, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function deleteExpenseRequest(id) {
    const res = await axios.delete(`${api}/expense-requests/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function fetchExpenseAttachment(file) {
    const res = await axios.get(`${api}/expense-requests/attachment/${file}`, {
        headers: {
            'Authorization': `${getToken()}`
        },
        responseType: 'blob'
    });
    return res.data;
}

export async function fetchExpenseApprovalsByApproverID(id) {
    const res = await axios.get(`${api}/expense-approvals/approver/${id}`, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
}

export async function updateExpenseApprovals(id, data) {
    const res = await axios.put(`${api}/expense-approvals/${id}`, data, {
        headers: {
            'Authorization': `${getToken()}`
        }
    });
    return res.data;
} 