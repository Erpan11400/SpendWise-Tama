import React from 'react';

export default function PeriodeDropdown({ bulan, setBulan, tahun, setTahun, monthOptions, yearOptions }) {
  return (
    <div className='bg-purple rounded-3' style={{ width: '150px', paddingRight: '7px', paddingBottom: '7px' }}>
      <div className='bg-gray d-flex flex-column p-2 rounded-3' style={{ width: '150px' }}>
        <p className='m-0 small text-end text-muted'>Periode</p>
        
        <select 
          className="form-select form-select-sm border-0 bg-transparent fw-bold p-0 shadow-none"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          style={{ cursor: 'pointer' }}
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select 
          className="form-select form-select-sm border-0 bg-transparent p-0 small shadow-none"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          style={{ cursor: 'pointer', fontSize: '0.85rem' }}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
}