import React, { useState, useEffect } from 'react';
import API_BASE_URL from './api';

function Teachers() {
  const [viewMode, setViewMode] = useState('list');
  const [teachers, setTeachers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const fetchTeachers = () => {
    fetch(`${API_BASE_URL}/api/teachers`)
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error("Error fetching teachers:", err));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('subject', subject);
    formData.append('phone', phone);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const url = editId 
      ? `${API_BASE_URL}/api/teachers/${editId}` 
      : `${API_BASE_URL}/api/teachers`;
    
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      body: formData
    })
      .then((res) => res.json())
      .then(() => {
        alert(editId ? 'መምህሩ በትክክል ተስተካክሏል!' : 'መምህሩ በትክክል ተመዝግቧል!');
        fetchTeachers();
        resetForm();
      })
      .catch((err) => {
        console.error('Error saving teacher:', err);
        alert('ማስቀመጥ አልተቻለም።');
      });
  };

  const handleEditClick = (teacher) => {
    setEditId(teacher.id);
    setName(teacher.name);
    setSubject(teacher.subject);
    setPhone(teacher.phone);
    setPhotoFile(null);
    setViewMode('add');
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('እርግጠኛ ነዎት ይህንን መምህር ማጥፋት ይፈልጋሉ?')) {
      fetch(`${API_BASE_URL}/api/teachers/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => {
          fetchTeachers();
        })
        .catch((err) => console.error('Error deleting teacher:', err));
    }
  };

  const resetForm = () => {
    setName('');
    setSubject('');
    setPhone('');
    setPhotoFile(null);
    setEditId(null);
    setViewMode('list');
  };

  return (
    <div style={{ padding: '20px' }}>
      {viewMode === 'list' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e293b', fontWeight: 'bold' }}>Teachers</h2>
            <button
              onClick={() => { resetForm(); setViewMode('add'); }}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Add Teacher
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '14px' }}>
                  <th style={{ padding: '16px' }}>No</th>
                  <th style={{ padding: '16px' }}>Photo</th>
                  <th style={{ padding: '16px' }}>Name</th>
                  <th style={{ padding: '16px' }}>Subject</th>
                  <th style={{ padding: '16px' }}>Phone</th>
                  <th style={{ padding: '16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher, index) => (
                    <tr key={teacher.id} style={{ borderBottom: '1px solid #f8fafc', color: '#334155' }}>
                      <td style={{ padding: '16px' }}>{index + 1}</td>
                      <td style={{ padding: '16px' }}>
                        <img 
                          src={teacher.photo ? `${API_BASE_URL}${teacher.photo}` : "https://via.placeholder.com/40"} 
                          alt="Teacher" 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{teacher.name}</td>
                      <td style={{ padding: '16px' }}>{teacher.subject}</td>
                      <td style={{ padding: '16px' }}>{teacher.phone}</td>
                      <td style={{ padding: '16px' }}>
                        <button 
                          style={{ background: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '6px 10px', marginRight: '8px', cursor: 'pointer' }}
                          onClick={() => handleEditClick(teacher)}
                        >
                          ✏️
                        </button>
                        <button 
                          style={{ background: '#ffe4e6', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                          onClick={() => handleDeleteTeacher(teacher.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                      ምንም መምህር በዳታቤዝ ውስጥ አልተገኘም።
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '24px', color: '#0f172a' }}>{editId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Name *</label>
              <input 
                type="text" 
                placeholder="Enter teacher name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Subject *</label>
              <input 
                type="text" 
                placeholder="Enter subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Phone *</label>
              <input 
                type="text" 
                placeholder="Enter phone number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Upload Photo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={resetForm}
                style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 22px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '6px', cursor: 'pointer' }}
              >
                {editId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Teachers;