import axios from 'axios'

const URL = 'http://localhost:3000'

const getAccessToken = () => {
    return localStorage.getItem('accessToken')
}

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken')
}

const putAccessToken = (data) => {
    return localStorage.setItem('accessToken', data)
}

const putRefreshToken = (data) => {
    return localStorage.setItem('refreshToken', data)
}

const route = axios.create({
    baseURL: URL
})

const getUser = async () => {
    return route.get('/users/me', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const createUser = async (fullName, userName, email, password) => {
    await route.post('/users', {
        fullName,
        userName,
        email,
        password
    })
}

const login = async (email, password) => {
    return route.post('/authentication', { email, password })
}

const logout = async () => {
    return route.delete('/authentication', {
        data: { refreshToken: getRefreshToken() },
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

// Budgeting
const getBudget = async (bulan, tahun) => {
    return route.post('/budgeting/in', {
        bulan, tahun
    }, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const getAllBudget = async () => {
    return route.get('/budgeting', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const addBudget = async (name, allocation) => {
    return route.post('/budgeting', { name, allocation }, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const getBudgetByIdentic = async (budget_id) => {
    return route.get(`/budgeting/${budget_id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const editBudget = async (budget_id, name, allocation) => {
    return route.put(`/budgeting/${budget_id}`, { name, allocation }, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const deleteBudget = (budget_id) => {
    return route.delete(`/budgeting/${budget_id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

// Wallet
const getWallet = async () => {
    return route.get('/wallets', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

// Transaction
const getTransaction = async () => {
    return route.get('/transactions', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const createTransaction = async (newTransaction) => {
    return route.post('/transactions', {
        newTransaction
    }, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const getTransactionById = async (transaction_id) => {
    return route.get(`/transactions/${transaction_id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const updateTransaction = async (oldTransaction, newTransaction) => {
    return route.put(`/transactions/${oldTransaction.id}`, {
        oldTransaction,
        newTransaction
    }, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const deleteTransaction = async (transaction_id) => {
    return route.delete(`/transactions/${transaction_id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

const getIncomeAndExpense = async (bulan, tahun) => {
    return route.get(`/transactions/${bulan}/${tahun}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
}

export {
    getAccessToken,
    putAccessToken,
    putRefreshToken,
    // 
    getUser,
    createUser,
    login,
    logout,
    // 
    getBudget,
    getAllBudget,
    getWallet,
    getBudgetByIdentic,
    addBudget,
    editBudget,
    deleteBudget,
    // 
    createTransaction,
    getTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getIncomeAndExpense,
}