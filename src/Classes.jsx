import React, { useState, useEffect } from 'react';

function Classes() {
  const [classesList, setClassesList] = useState([]);
  const [className, setClassName] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchClasses = () => {
    fetch('http://localhost:5000/api/classes')
      .then((res) => res.json())
      .then((data) => setClassesList(data))
      .catch((err) => console.error("Error fetching classes:", err));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const url = editId 
      ? `http://localhost:5000/api/classes/${editId}` 
      : 'http://localhost:5000/api/classes';
    
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_name: className })
    })
      .then((res) => res.json())
      .then(() => {
        alert(editId ? 'ክፍሉ በትክክል ተስተካክሏል!' : 'ክፍሉ በትክክል ተመዝግቧል!');
        fetchClasses();
        resetForm();
      })
      .catch((err) => console.error('Error saving class:', err));
  };

  const handleEditClick = (cls) => {
    setEditId(cls.id);
    setClassName(cls.class_name);
  };

  const handleDeleteClass = (id) => {
    if (window.confirm('እርግጠኛ ነዎት ይህንን ክፍል ማጥፋት ይፈልጋሉ?')) {
      fetch(`http://localhost:5000/api/classes/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => fetchClasses())
        .catch((err) => console.error('Error deleting class:', err));
    }
  };

  const resetForm = () => {
    setClassName('');
    setEditId(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '20px' }}>Classes Management</h2>

      {/* Add / Edit Form */}
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <input 
          type="text" 
          placeholder="Enter class name (e.g. Grade 5)" 
          value={className} 
          onChange={(e) => setClassName(e.target.value)} 
          required 
          style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button 
          type="submit" 
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          {editId ? 'Update Class' : '+ Add Class'}
        </button>
        {editId && (
          <button 
            type="button" 
            onClick={resetForm}
            style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Classes Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '14px' }}>
              <th style={{ padding: '16px' }}>No</th>
              <th style={{ padding: '16px' }}>Class Name</th>
              <th style={{ padding: '16px' }}>Students Count (Amount)</th>
              <th style={{ padding: '16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {classesList && classesList.length > 0 ? (
              classesList.map((cls, index) => (
                <tr key={cls.id} style={{ borderBottom: '1px solid #f8fafc', color: '#334155' }}>
                  <td style={{ padding: '16px' }}>{index + 1}</td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{cls.class_name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '13px' }}>
                      {cls.student_count || 0} Students
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      style={{ background: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '6px 10px', marginRight: '8px', cursor: 'pointer' }}
                      onClick={() => handleEditClick(cls)}
                      title="Edit Class"
                    >
                      ✏️
                    </button>
                    <button 
                      style={{ background: '#ffe4e6', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                      onClick={() => handleDeleteClass(cls.id)}
                      title="Delete Class"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  ምንም ክፍል በዳታቤዝ ውስጥ አልተገኘም።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Classes;