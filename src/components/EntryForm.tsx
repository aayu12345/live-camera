'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EntryForm({ onAdd }: { onAdd: () => void }) {
  const [truckNumber, setTruckNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [personName, setPersonName] = useState('');
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState('');
  const [preview2, setPreview2] = useState('');
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (num === 1) {
        setImage1(file);
        setPreview1(URL.createObjectURL(file));
      } else {
        setImage2(file);
        setPreview2(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckNumber || !weight || !personName || !image1 || !image2) {
      setError('Please fill all fields and upload exactly 2 images.');
      return;
    }
    setError('');
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');
    
    try {
      // 1. Upload Images to Supabase
      const ts = Date.now();
      const filename1 = `${ts}_1_${image1!.name}`;
      const filename2 = `${ts}_2_${image2!.name}`;
      
      const { data: upload1, error: err1 } = await supabase.storage.from('truck-images').upload(filename1, image1!);
      if (err1) throw new Error('Failed to upload image 1: ' + err1.message);
      
      const { data: upload2, error: err2 } = await supabase.storage.from('truck-images').upload(filename2, image2!);
      if (err2) throw new Error('Failed to upload image 2: ' + err2.message);

      const url1 = supabase.storage.from('truck-images').getPublicUrl(filename1).data.publicUrl;
      const url2 = supabase.storage.from('truck-images').getPublicUrl(filename2).data.publicUrl;

      // 2. Save data to API
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          truckNumber,
          weight: parseFloat(weight),
          personName,
          image1Url: url1,
          image2Url: url2
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save entry');
      }

      setSuccess('Entry successfully saved!');
      setTruckNumber(''); setWeight(''); setPersonName('');
      setImage1(null); setImage2(null);
      setPreview1(''); setPreview2('');
      setTimeout(() => setSuccess(''), 3000);
      onAdd();

    } catch (e: any) {
      setError(e.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-file-pen"></i> New Entry</div>
        </div>
        <div style={{ padding: '20px' }}>
          {error && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '16px', padding: '10px', background: '#fef2f2', borderRadius: '6px' }}>{error}</div>}
          {success && <div style={{ color: '#16a34a', fontSize: '12px', marginBottom: '16px', padding: '10px', background: '#f0fdf4', borderRadius: '6px' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Truck Plate Number</label>
              <input type="text" className="form-input" value={truckNumber} onChange={e => setTruckNumber(e.target.value)} placeholder="e.g. RJ14CB5278" disabled={loading} />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (KG)</label>
              <input type="number" className="form-input" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 24500" disabled={loading} />
            </div>

            <div className="form-group">
              <label className="form-label">Person Name</label>
              <input type="text" className="form-input" value={personName} onChange={e => setPersonName(e.target.value)} placeholder="Driver or Operator Name" disabled={loading} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Image 1 (Front View / Plate)</label>
                <div className="upload-area" onClick={() => document.getElementById('img1')?.click()}>
                  {preview1 ? <img src={preview1} style={{width:'100%', height:'120px', objectFit:'cover', borderRadius:'4px'}} /> : (
                    <>
                      <div className="upload-icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                      <div style={{fontSize:'12px', color:'#6b7280'}}>Click to upload</div>
                    </>
                  )}
                </div>
                <input type="file" id="img1" hidden accept="image/*" onChange={e => handleImage(e, 1)} disabled={loading} />
              </div>
              
              <div>
                <label className="form-label">Image 2 (Side View / Load)</label>
                <div className="upload-area" onClick={() => document.getElementById('img2')?.click()}>
                  {preview2 ? <img src={preview2} style={{width:'100%', height:'120px', objectFit:'cover', borderRadius:'4px'}} /> : (
                    <>
                      <div className="upload-icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                      <div style={{fontSize:'12px', color:'#6b7280'}}>Click to upload</div>
                    </>
                  )}
                </div>
                <input type="file" id="img2" hidden accept="image/*" onChange={e => handleImage(e, 2)} disabled={loading} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span><i className="fa-solid fa-spinner fa-spin"></i> Processing...</span> : <span><i className="fa-solid fa-check"></i> Submit Entry</span>}
            </button>
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Submission</h3>
            <p className="modal-desc">Please confirm all details. Once submitted, you will <strong>NOT</strong> be able to edit or delete this entry.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-primary" style={{width:'auto'}} onClick={confirmSubmit}>Confirm & Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
