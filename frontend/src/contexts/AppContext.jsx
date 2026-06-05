import { createContext, useContext, useState } from "react"

export const createdContext = createContext()

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(
        {
            fullName: 'Ervan Setyatama',
            username: 'Tama',
            email: 'tama@gg.com',
            password: 'tama1234',
            budgets: [
                // { id: 'bud-1', name: 'Makan', used: 50000, allocation: 100000 },
                // { id: 'bud-2', name: 'Transport', used: 0, allocation: 50000 },
                // { id: 'bud-3', name: 'Kost', used: 650000, allocation: 750000 }
            ],
            wallets: [
                { id: 'wlt-1', name: "BCA", amount: 0 },
                { id: 'wlt-2', name: "Cash", amount: 0 },
                { id: 'wlt-3', name: "OVO", amount: 0 },
                { id: 'wlt-4', name: "Dana", amount: 0 },
            ],
            transactions: [
                // {
                //     id: 'tr-1',
                //     type: 'Pengeluaran',
                //     descript: 'Makan',
                //     amount: -100000,
                //     category: 'Makan',
                //     date: '2025-12-12',
                //     wallet: 'BCA'
                // },
                // {
                //     id: 'tr-2',
                //     type: 'Pemasukan',
                //     descript: 'Ambil duit',
                //     amount: 100000,
                //     category: 'Makan',
                //     date: '2025-12-12',
                //     wallet: 'BCA'
                // }
            ]
        }
        // null
    )

    const addBudget = (newBudget) => {
        setUser((prev) => {
            return {
                ...prev,
                budgets: [...prev.budgets, newBudget]
            }
        })
    }

    const updateBudget = (newBudget) => {
        setUser((prev) => {
            return {
                ...prev,
                budgets: prev.budgets.map((budget) => {
                    if (budget.id !== newBudget.id) return budget
                    else return {
                        ...budget,
                        name: newBudget.name,
                        allocation: newBudget.allocation
                    }
                })
            }
        })
    }

    const addTransactions = (newTransaction) => {
        setUser((prev) => {
            return {
                ...prev,
                budgets: prev.budgets.map((budget) => {
                    if (budget.name !== newTransaction.category) return budget
                    else return {
                        ...budget,
                        used: budget.used - newTransaction.amount
                    }
                }),
                wallets: prev.wallets.map((wallet) => {
                    if (wallet.name !== newTransaction.wallet) return wallet

                    const newAmount = wallet.amount + newTransaction.amount

                    return { ...wallet, amount: newAmount }
                }),
                transactions: [
                    ...prev.transactions,
                    newTransaction
                ]
            }
        })
    }

    const updateTransaction = (oldTransaction, newTransaction) => {
        setUser((prev) => {
            return {
                ...prev,
                budgets: oldTransaction.category === newTransaction.category ? (
                    prev.budgets.map((budget) => {
                        if (budget.name === oldTransaction.category && budget.name === newTransaction.category) {
                            return {
                                ...budget,
                                used: (budget.used + oldTransaction.amount) - newTransaction.amount
                            }
                        }
                        return budget
                    })
                ) : (
                    prev.budgets.map((budget) => {
                        if (budget.name === oldTransaction.category) {
                            return {
                                ...budget,
                                used: (budget.used + oldTransaction.amount)
                            }
                        }
                        if (budget.name === newTransaction.category) {
                            return {
                                ...budget,
                                used: (budget.used - newTransaction.amount)
                            }
                        }
                        if (budget.name !== oldTransaction.category && budget.name !== newTransaction.category) return budget
                    })
                ),
                wallets: oldTransaction.wallet === newTransaction.wallet ? (
                    prev.wallets.map((wallet) => {
                        if (wallet.name !== newTransaction.wallet) return wallet

                        const newAmount = (wallet.amount - oldTransaction.amount) + newTransaction.amount

                        return { ...wallet, amount: newAmount }
                    })
                ) : (
                    prev.wallets.map((wallet) => {
                        if (wallet.name === oldTransaction.wallet) {
                            return { ...wallet, amount: (wallet.amount - oldTransaction.amount) }
                        }
                        if (wallet.name === newTransaction.wallet) {
                            return { ...wallet, amount: (wallet.amount + newTransaction.amount) }
                        }
                        if (wallet.name !== oldTransaction.wallet && wallet.name !== newTransaction.wallet) {
                            return wallet
                        }
                    })
                ),
                transactions: prev.transactions.map((transaction) => {
                    if (transaction.id !== newTransaction.id) return transaction
                    else return {
                        ...newTransaction,
                        type: newTransaction.type,
                        descript: newTransaction.descript,
                        amount: newTransaction.amount,
                        category: newTransaction.category,
                        wallet: newTransaction.wallet
                    }
                })
            }
        })
    }

    const deleteTransaction = (transactionCandidate) => {
        setUser((prev) => {
            return {
                ...prev,
                budgets: prev.budgets.map((budget) => {
                    if (budget.name !== transactionCandidate.category) return budget
                    return {
                        ...budget,
                        used: budget.used + transactionCandidate.amount
                    }
                }),
                wallets: prev.wallets.map((wallet) => {
                    if (wallet.name !== transactionCandidate.wallet) return wallet

                    const newAmount = wallet.amount - transactionCandidate.amount

                    return { ...wallet, amount: newAmount }
                }),
                transactions: prev.transactions.filter((transaction) => transaction.id !== transactionCandidate.id)
            }
        })
    }

    const login = (email, password) => {
        setUser(
            {
                fullName: 'I\'m Tama',
                username: 'Tama',
                email,
                password,
                budgets: [],
                wallets: [
                    { id: 'wlt-1', name: "BCA", amount: 0 },
                    { id: 'wlt-2', name: "Cash", amount: 0 },
                    { id: 'wlt-3', name: "OVO", amount: 0 },
                    { id: 'wlt-4', name: "Dana", amount: 0 },
                ],
                transactions: []
            })
    }

    const signin = (fullName, username, email, password) => {
        setUser({
            fullName,
            username,
            email,
            password,
            budgets: [],
            wallets: [
                { id: 'wlt-1', name: "BCA", amount: 0 },
                { id: 'wlt-2', name: "Cash", amount: 0 },
                { id: 'wlt-3', name: "OVO", amount: 0 },
                { id: 'wlt-4', name: "Dana", amount: 0 },
            ],
            transactions: []
        })
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <createdContext.Provider value={{ user, addTransactions, updateTransaction, deleteTransaction, addBudget, updateBudget, login, signin, logout }}>
            {children}
        </createdContext.Provider>
    )
}

const useAppContext = () => {
    const context = useContext(createdContext)

    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider')
    }

    return context
}

export default useAppContext