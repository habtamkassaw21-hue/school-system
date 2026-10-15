import React, { useState, useEffect } from 'react';
import './Announcements.css';

function Announcements({ role }) {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // ከ localStorage ላይ የገባውን Role ማንበብ
  const detectUserRole = () => {
    if (role) return role;
    const storedRole = localStorage.getItem('role') || localStorage.getItem('userRole');
    return storedRole || 'Student';
  };

  const [userRole, setUserRole] = useState(detectUserRole);

  useEffect(() => {
    setUserRole(detectUserRole());
  }, [role]);

  // Student መሆኑን ማረጋገጥ
  const isStudent = userRole.toString().trim().toLowerCase() === 'student';

  const fetchAnnouncements = () => {
    fetch('http://localhost:5000/api/announcements')
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error('Error fetching announcements:', err));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // አዲስ ማስታወቂያ መፖስት ማድረግ (Teacher & Admin ብቻ)
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (isStudent) return;

    fetch('http://localhost:5000/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, date: new Date().toLocaleDateString() }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('ማስታወቂያው በትክክል ተለጥፏል!');
        setTitle('');
        setContent('');
        setShowAddForm(false);
        fetchAnnouncements();
      })
      .catch((err) => console.error('Error adding announcement:', err));
  };

  // ማስታወቂያ ማጥፋት (Teacher & Admin ብቻ)
  const handleDelete = (id) => {
    if (isStudent) return;

    if (window.confirm('እርግጠኛ ነዎት ይህንን ማስታወቂያ ማጥፋት ይፈልጋሉ?')) {
      fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => fetchAnnouncements())
        .catch((err) => console.error('Error deleting announcement:', err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', fontWeight: 'bold' }}>
          📢 School Announcements
        </h2>

        {/* Student ካልሆነ አዲስ ማስታወቂያ የመለጠፊያ አዝራር ይታያል */}
        {!isStudent && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {showAddForm ? 'Cancel' : '+ New Announcement'}
          </button>
        )}
      </div>

      {/* Post Form (Admin & Teacher Only) */}
      {showAddForm && !isStudent && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '15px', color: '#334155' }}>Create Announcement</h3>
          <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Announcement Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
            <textarea 
              placeholder="Write announcement contents here..." 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
              rows="4"
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
            />
            <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
              Post Announcement
            </button>
          </form>
        </div>
      )}

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {announcements && announcements.length > 0 ? (
          announcements.map((item) => (
            <div key={item.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ color: '#0f172a', margin: 0 }}>{item.title}</h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.date}</span>
              </div>
              <p style={{ color: '#475569', lineHeight: '1.5', margin: 0 }}>{item.content}</p>

              {/* Student ካልሆነ ማጥፊያ አዝራር ይታያል */}
              {!isStudent && (
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ background: '#ffe4e6', color: '#e11d48', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', marginTop: '12px', fontSize: '12px', fontWeight: 'bold' }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }}>
            ምንም የወጡ ማስታወቂያዎች የሉም።
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;