import { SlCompass } from 'react-icons/sl'
import useAppContext from '../contexts/AppContext'
import { useEffect, useState } from 'react'
import { getWallet } from '../utils/requestAPi'

export default function Wallet() {
    const [wallets, setWallets] = useState([])

    const getWallets = async () => {
        const res = await getWallet()
        setWallets(res.data.data.wallets)
    }

    useEffect(() => {
        getWallets()
    }, [wallets])

    return (
        <article className='p-3 w-100'>
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
                        <h2 className='m-0 fs-3' style={{ height: '34px' }}>Wallet</h2>
                        <p className='m-0'><span className='opacity-50'>Kelola dompet dan rekeningmu</span> 💳</p>
                    </div>
                </div>
            </div>
            <div
                style={{
                    background: "white",
                    borderRadius: "20px",
                    marginTop: "30px",
                    padding: "20px",
                }}
            >
                <h2 style={{ marginBottom: "20px", color: "#1E0A78" }}>
                    Wallet List
                </h2>

                {wallets.map((item, index) => (
                    <div key={index} className="p-3 mb-2 bg-white border border-light-subtle rounded-4 d-flex justify-content-between align-items-center shadow-sm">
                        {/* Sisi Kiri: Gambar Persegi Panjang + Nama */}
                        <div className="d-flex align-items-center gap-3">
                            {/* Bingkai Gambar Persegi Panjang */}
                            <div
                                className="d-flex align-items-center justify-content-center bg-light rounded-3 overflow-hidden border"
                                style={{ width: '65px', height: '40px' }} // Rasio persegi panjang yang pas untuk logo bank
                            >
                                <img
                                    src={`/asset-wallet-logos/${item.name}.png`}
                                    alt={item.name}
                                    className="w-100 h-100 object-fit-contain p-1"
                                />
                            </div>

                            {/* Detail Nama Akun */}
                            <div>
                                <span className="fw-bold text-dark d-block fs-6">{item.name}</span>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Metode Pembayaran</small>
                            </div>
                        </div>

                        {/* Sisi Kanan: Nominal Saldo */}
                        <div className="text-end">
                            <span className="fs-5 fw-bolder text-purple">
                                Rp {item.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </article >
    )
}
