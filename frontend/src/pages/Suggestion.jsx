import React from 'react'
import { SlCompass } from 'react-icons/sl'
import BlockTips from '../components/BlockTips'
import { Col, Container, Row } from 'react-bootstrap'

export default function Suggestion() {
  return (
    <article className='p-3'>
      <div className='mb-4'>
        <div className='d-flex text-purple gap-3'>
          <div>
            <div className='d-flex align-items-center' style={{ height: '34px' }}>
              <SlCompass className='mt-1 fs-5' />
            </div>
            <div style={{ height: '24px' }} />
          </div>
          <div>
            <h2 className='m-0 fs-3' style={{ height: '34px' }}>Suggestion</h2>
            <p className='m-0'><span className='opacity-50'>Optimalkan pengeluaran anda dengan rekomendasi cerdas</span> 🤩</p>
          </div>
        </div>
      </div>
      <div className='bg-purple rounded-4'>
        <div style={{ height: '8px' }} />
        <div className='suggestion_tips'>
          <BlockTips className='bg-yellow bg-opacity-50 p-2 border border-3 border-yellow rounded-4' message='Sebaiknya anda mengurasi jajan, karena sisa pada bulan ini sudah menipis' style={{ width: '350px' }} />
          <BlockTips className='bg-yellow bg-opacity-50 p-2 border border-3 border-yellow rounded-4' message='Sebaiknya anda mengurasi jajan, karena sisa pada bulan ini sudah menipis' style={{ width: '350px' }} />
          <BlockTips className='bg-yellow bg-opacity-50 p-2 border border-3 border-yellow rounded-4' message='Sebaiknya anda mengurasi jajan, karena sisa pada bulan ini sudah menipis' style={{ width: '350px' }} />
          <BlockTips className='bg-yellow bg-opacity-50 p-2 border border-3 border-yellow rounded-4' message='Sebaiknya anda mengurasi jajan, karena sisa pada bulan ini sudah menipis' style={{ width: '350px' }} />
          <BlockTips className='bg-yellow bg-opacity-50 p-2 border border-3 border-yellow rounded-4' message='Sebaiknya anda mengurasi jajan, karena sisa pada bulan ini sudah menipis' style={{ width: '350px' }} />
        </div>
      </div>
    </article>
  )
}
