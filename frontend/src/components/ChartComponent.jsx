import React, { useEffect, useState } from 'react'
import { Chart } from "react-google-charts";
import { getIncomeAndExpense } from '../utils/requestAPi';

export default function ChartComponent({ bulan, tahun }) {
    const [pemasukan, setPemasukan] = useState([])
    const [pengeluaran, setPengeluaran] = useState([])

    const calculateIncome = () => {
        if (pemasukan.length < 1) {
            return 0
        }
        return pemasukan.reduce((acc, income) => acc + income.amount, 0)
    }

    const calculateExpense = () => {
        if (pengeluaran.length < 1) {
            return 0
        }
        return pengeluaran.reduce((acc, expense) => acc + Math.abs(expense.amount), 0)
    }

    const getAmountEveryCategory = (category) => {
        return pengeluaran.reduce((result, expense) => {
            if (expense.category === category) {
                result += Math.abs(expense.amount)
            }
            return result
        }, 0)
    }

    const barData = [
        ["Element", "Density", { role: "style" }],
        ["Pemasukan", calculateIncome(), "#86EE60"],
        ["Pengeluaran", calculateExpense(), "#D71313"],
    ];

    const pieData = [
        ["Category", "Expense"],
        ['Sewa tempat tinggal', getAmountEveryCategory('Sewa tempat tinggal')],
        ['Pembayaran cicilan', getAmountEveryCategory('Pembayaran cicilan')],
        ['Asuransi', getAmountEveryCategory('Asuransi')],
        ['Belanja bahan makan', getAmountEveryCategory('Belanja bahan makan')],
        ['Transport', getAmountEveryCategory('Transport')],
        ['Makan di luar', getAmountEveryCategory('Makan di luar')],
        ['Hiburan', getAmountEveryCategory('Hiburan')],
        ['Tagihan listrik atau air', getAmountEveryCategory('Tagihan listrik atau air')],
        ['Kesehatan', getAmountEveryCategory('Kesehatan')],
        ['Pendidikan', getAmountEveryCategory('Pendidikan')],
        ['Lainnya', getAmountEveryCategory('Lainnya')]
    ];

    const options = {
        is3D: true,
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: {
                color: "#1C0770",
                fontSize: 14,
            },
        },
    };

    const getTransaction = async () => {
        const res = await getIncomeAndExpense(bulan, tahun)

        setPemasukan(res.data.data.income)
        setPengeluaran(res.data.data.expense)
    }

    useEffect(() => {
        getTransaction()
    }, [bulan, tahun])

    return (
        // 1. Ubah align-items-stretch menjadi align-items-start agar tidak dipaksa melar ke bawah
        <div className='d-flex align-items-start w-100 gap-3'>

            {/* Kolom Kiri: Column Chart */}
            <div className='w-50 bg-purple d-flex flex-column rounded-4' style={{ height: '450px', paddingTop: '8px' }}>
                <div className='bg-white p-3 flex-grow-1 w-100 rounded-4 d-flex flex-column'>
                    <h3 className='m-0 fs-5 text-purple text-center mb-2'>Perbandingan Transaksi</h3>

                    {pemasukan.length > 0 || pengeluaran.length > 0 ? (
                        <div className='flex-grow-1 w-100' style={{ position: 'relative', minHeight: '0' }}>
                            <Chart chartType="ColumnChart" width="100%" height='100%' data={barData} />
                        </div>
                    ) : (
                        <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
                            <p className='text-muted m-0 fs-6 fw-light'>Belum ada transaksi</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Kolom Kanan: Pie Chart */}
            <div className='w-50 bg-purple d-flex flex-column rounded-4' style={{ height: '450px', paddingTop: '8px' }}>
                <div className='bg-white p-3 flex-grow-1 w-100 rounded-4 d-flex flex-column'>
                    <h3 className='m-0 fs-5 text-purple text-center mb-2'>Persentasi Transaksi</h3>

                    {pengeluaran.length > 0 ? (
                        <div className='flex-grow-1 w-100' style={{ position: 'relative', minHeight: '0' }}>
                            <Chart
                                chartType="PieChart"
                                data={pieData}
                                options={options}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    ) : (
                        <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
                            <p className='text-muted m-0 fs-6 fw-light'>Belum ada transaksi pengeluaran</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
