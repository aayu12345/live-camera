'use client';

import { useState, useEffect, useCallback } from 'react';
import EntryForm from './EntryForm';

export default function DashboardClient() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [truckNumber, setTruckNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (truckNumber) q.append('truckNumber', truckNumber);
      if (startDate) q.append('startDate', startDate);
      if (endDate) q.append('endDate', endDate);

      const res = await fetch(`/api/entries?${q.toString()}`);
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, truckNumber, startDate, endDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="grid-main">
      {/* LEFT COLUMN: Filters + Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Filters Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-filter"></i> Filters</div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label className="form-label">Truck Number</label>
              <input type="text" className="form-input" style={{width: '180px'}} value={truckNumber} onChange={e => {setTruckNumber(e.target.value); setPage(1);}} placeholder="Search plate..." />
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" style={{width: '150px'}} value={startDate} onChange={e => {setStartDate(e.target.value); setPage(1);}} />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" style={{width: '150px'}} value={endDate} onChange={e => {setEndDate(e.target.value); setPage(1);}} />
            </div>
            <button className="btn-secondary" style={{padding: '10px 14px'}} onClick={() => { setTruckNumber(''); setStartDate(''); setEndDate(''); setPage(1); }}>
              Clear
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="card table-card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-table-list"></i> Registration Log</div>
            <span style={{fontSize:'12px',color:'#9ca3af'}}>{totalCount} records</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>ID</th>
                  <th>License Plate</th>
                  <th className="r">Weight</th>
                  <th>Person Name</th>
                  <th className="c">Images</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="c" style={{padding: '40px'}}>Loading...</td></tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <i className="fa-regular fa-folder-open"></i>
                        No entries found matching criteria.
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map(entry => {
                    const dt = new Date(entry.createdAt);
                    const ts = dt.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) + ' ' + dt.toLocaleTimeString('en-US', { hour12: false });
                    return (
                      <tr key={entry.id}>
                        <td className="mono">{ts}</td>
                        <td className="mono" title={entry.id}>{entry.id.split('-')[0]}...</td>
                        <td><span className="plate-chip">{entry.truckNumber}</span></td>
                        <td className="r weight-cell">{entry.weight.toLocaleString()} kg</td>
                        <td>{entry.personName}</td>
                        <td className="c" style={{display:'flex', gap:'8px', justifyContent:'center'}}>
                          <a href={entry.image1Url} target="_blank" rel="noopener noreferrer" style={{color:'#2563eb',textDecoration:'none',fontSize:'20px'}}><i className="fa-solid fa-image"></i></a>
                          <a href={entry.image2Url} target="_blank" rel="noopener noreferrer" style={{color:'#2563eb',textDecoration:'none',fontSize:'20px'}}><i className="fa-solid fa-image"></i></a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Page {page} of {totalPages}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{padding:'6px 12px', fontSize:'12px'}} disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <button className="btn-secondary" style={{padding:'6px 12px', fontSize:'12px'}} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Form */}
      <div>
        <div style={{ position: 'sticky', top: '84px' }}>
          <EntryForm onAdd={() => { setPage(1); fetchEntries(); }} />
        </div>
      </div>
    </div>
  );
}
