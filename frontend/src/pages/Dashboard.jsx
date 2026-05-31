import React, { useEffect, useState } from 'react'
import { ProgressBar, Spinner } from 'react-bootstrap'
import { SlCompass } from "react-icons/sl"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi'
import { FaRegEdit } from "react-icons/fa";
import BlockTips from '../components/BlockTips'
import BudgetItem from '../components/BudgetItem'
import AddBudgeting from '../components/AddBudgeting'
import EditBudgeting from '../components/EditBudgeting'
import useAppContext from '../contexts/AppContext'
import { getBudget, getWallet } from '../utils/requestAPi';
import PeriodeDropdown from '../components/PeriodeDropdown';
import ChartComponent from '../components/ChartComponent';

export default function Dashboard() {
  const { userName } = useAppContext().user
  const [budgets, setBudgets] = useState([])
  const [wallets, setWallets] = useState([])

  const [showCash, setShowCash] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editBudgetId, setEditBudgetId] = useState('')

  const [bulan, setBulan] = useState('Mei')
  const [tahun, setTahun] = useState('2026')

  const showEditModal = (id, show) => {
    setEditBudgetId(id)
    setEditModal(show)
  }

  const totalSaldo = wallets.reduce((acc, wallet) => acc + wallet.amount, 0)

  const getBudgets = async () => {
    const res = await getBudget(bulan, tahun)
    setBudgets(res.data.data.budgets)
  }

  const getWallets = async () => {
    const res = await getWallet()
    setWallets(res.data.data.wallets)
  }

  useEffect(() => {
    getBudgets()
    getWallets()
  }, [bulan, tahun])

  return (
    <article className='p-3'>

      {/* Header */}
      <div className='d-flex justify-content-between mb-4'>
        <div className='d-flex text-purple gap-3'>
          <div>
            <div className='d-flex align-items-center' style={{ height: '34px' }}>
              <SlCompass className='mt-1 fs-5' />
            </div>
            <div style={{ height: '24px' }} />
          </div>
          <div>
            <h2 className='m-0 fs-3' style={{ height: '34px' }}>Dasboard</h2>
            <p className='m-0'>Hallo, {userName}! 🙌</p>
          </div>
        </div>
        <PeriodeDropdown bulan={bulan} setBulan={setBulan} tahun={tahun} setTahun={setTahun} />
      </div>

      {/* Cash */}
      <div className='bg-purple p-4 rounded-4 mb-4'>
        <div className='d-flex justify-content-between mb-2'>
          <div className='text-white'>
            <h3 className='fs-5 fw-light'>Your Cash</h3>
            <div className='d-flex align-items-center mb-2 gap-2'>
              {
                showCash ? (
                  <>
                    <p className='m-0 fs-5 fw-semibold'>Rp.{totalSaldo.toLocaleString()}</p>
                    <button className='d-flex align-items-center bg-transparent border-0 text-white' onClick={() => setShowCash((prev) => !prev)}><IoEyeOutline size={20} /></button>
                  </>
                ) : (
                  <>
                    <p className='m-0 fs-5 fw-semibold'>Rp.*******</p>
                    <button className='d-flex align-items-center bg-transparent border-0 text-white' onClick={() => setShowCash((prev) => !prev)}><IoEyeOffOutline size={20} /></button>
                  </>
                )
              }

            </div>
            <p className='m-0'>Manfaatkan Saldo dengan <span className='fw-medium text-yellow'>Bijak 💥</span></p>
          </div>
        </div>
      </div>

      <div className='bg-purple rounded-4 mb-4' style={{ minHeight: '100px' }}>
        <div style={{ height: '8px' }} />
        <div className='p-4 bg-white rounded-4' style={{ minHeight: '100px' }}>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h3 className='m-0 fs-5 fw-semibold text-purple'>Budgeting</h3>
            <button className='px-3 px-2 bg-gray border-0 d-flex align-items-center justify-content-center rounded-pill' onClick={() => setAddModal(true)}>
              <FiPlus />
              <p className='m-0 text-purple'>Tambah Budgeting</p>
            </button>
          </div>

          {/* Data Budgeting */}
          <div className='d-flex flex-column gap-4 justify-content-center'>
            {
              budgets.length > 0 ? (
                budgets.map((item) => (
                  <BudgetItem key={item.id} item={item} showEditModal={showEditModal} />
                ))
              ) : (
                <p className='text-center text-red'>Anda belum melakukan budgeting</p>
              )
            }
          </div>
        </div>
      </div>

      <ChartComponent bulan={bulan} tahun={tahun} />

      {
        addModal ? (
          <AddBudgeting close={() => setAddModal(false)} />
        ) : editModal ? (
          <EditBudgeting close={() => setEditModal(false)} id={editBudgetId} />
        ) : (<></>)
      }
    </article >
  )
}
