import React, { useState, useEffect } from 'react';
import './Attendance.css';

function Attendance({ role }) {
  const [selectedClass, setSelectedClass] = useState('Grade 1');
  const [attendanceList, setAttendanceList] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [initialStatus, setInitialStatus] = useState('Present');

  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('Present');

  // Role ን ከ localStorage ማወቅ
  const detectUserRole = () => {
    if (role) return role;
    const storedRole = localStorage.getItem('role') || localStorage.getItem('userRole');
    return storedRole || 'Student';
  };

  const [userRole, setUserRole] = useState(detectUserRole);

  useEffect(() => {
    setUserRole(detectUserRole());
  }, [role]);

  const isStudent = userRole.toString().trim().toLowerCase() === 'student';

  // 1. ከዳታቤዝ (Backend) መረጃዎችን ማምጣት
  const fetchAttendance = () => {
    fetch(`http://localhost:5000/api/attendance?class=${encodeURIComponent(selectedClass)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        // የተመረጠውን Class ብቻ ማጣራት
        const filtered = Array.isArray(data) 
          ? data.filter(item => (item.class_name || 'Grade 1') === selectedClass)
          : [];
        setAttendanceList(filtered);
      })
      .catch((err) => console.error('Error fetching attendance from DB:', err));
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedClass]);

  // 2. አዲስ ተማሪ ወደ ዳታቤዝ መጨመር (Save Record)
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (isStudent || !studentName.trim()) return;

    fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: studentName.trim(),
        class_name: selectedClass,
        status: initialStatus
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .then(() => {
        alert('ተማሪው በዳታቤዝ ውስጥ በትክክል ተመዝግቧል!');
        setStudentName('');
        setInitialStatus('Present');
        setShowAddForm(false);
        fetchAttendance(); // ዳታቤዙን ዳግም ማንበብ
      })
      .catch((err) => {
        console.error('Error saving to DB:', err);
        alert('መዝገቡን ማስቀመጥ አልተቻለም። ሰርቨሩን ያረጋግጡ!');
      });
  };

  // 3. የመገኘት ሁኔታን በቀጥታ በዳታቤዝ ማስተካከል (Present / Absent / Late)
  const handleStatusChange = (id, newStatus) => {
    if (isStudent) return;

    fetch(`http://localhost:5000/api/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(() => fetchAttendance())
      .catch((err) => console.error('Error updating status in DB:', err));
  };

  // Edit መጀመር
  const startEdit = (item) => {
    setEditingItem(item);
    setEditName(item.student_name);
    setEditStatus(item.status || 'Present');
  };

  // 4. የተስተካከለውን መዝገብ በዳታቤዝ ማዘመን
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (isStudent) return;

    fetch(`http://localhost:5000/api/attendance/${editingItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: editName,
        status: editStatus,
        class_name: selectedClass
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then(() => {
        alert('መረጃው በዳታቤዝ ውስጥ ተስተካክሏል!');
        setEditingItem(null);
        fetchAttendance();
      })
      .catch((err) => console.error('Error updating DB record:', err));
  };

  // 5. ከዳታቤዝ መዝገብ ማጥፋት (Delete)
  const handleDelete = (id) => {
    if (isStudent) return;

    if (window.confirm('እርግጠኛ ነዎት ይህንን መዝገብ ከዳታቤዝ ማጥፋት ይፈልጋሉ?')) {
      fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");
          return res.json();
        })
        .then(() => fetchAttendance())
        .catch((err) => console.error('Error deleting from DB:', err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', fontWeight: 'bold' }}>
          {isStudent ? 'My Attendance' : 'Attendance Management'}
        </h2>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px', color: '#64748b', fontWeight: '600' }}>Select Class:</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '600' }}
            >
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
            </select>
          </div>

          {!isStudent && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ background: '#2563eb', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              {showAddForm ? 'Cancel' : '+ Add Student'}
            </button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && !isStudent && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '15px', color: '#334155' }}>Add Student to {selectedClass} (Database)</h3>
          <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Student Full Name" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
              required 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1, minWidth: '200px' }}
            />
            <select 
              value={initialStatus} 
              onChange={(e) => setInitialStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Save Record
            </button>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingItem && !isStudent && (
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#0369a1' }}>Edit Attendance Record (Database)</h3>
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              required 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }}
            />
            <select 
              value={editStatus} 
              onChange={(e) => setEditStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
              Update
            </button>
            <button type="button" onClick={() => setEditingItem(null)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '14px' }}>
              <th style={{ padding: '16px' }}>No</th>
              <th style={{ padding: '16px' }}>Student Name</th>
              <th style={{ padding: '16px' }}>Class</th>
              <th style={{ padding: '16px' }}>Status</th>
              {!isStudent && <th style={{ padding: '16px' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {attendanceList && attendanceList.length > 0 ? (
              attendanceList.map((item, index) => {
                const status = item.status || 'Present';
                let statusBg = '#dcfce7';
                let statusColor = '#166534';

                if (status === 'Absent') {
                  statusBg = '#fee2e2';
                  statusColor = '#991b1b';
                } else if (status === 'Late') {
                  statusBg = '#fef9c3';
                  statusColor = '#854d0e';
                }

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc', color: '#334155' }}>
                    <td style={{ padding: '16px' }}>{index + 1}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{item.student_name}</td>
                    <td style={{ padding: '16px' }}>{item.class_name || selectedClass}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: statusBg,
                        color: statusColor,
                        fontWeight: 'bold'
                      }}>
                        {status}
                      </span>
                    </td>
                    {!isStudent && (
                      <td style={{ padding: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleStatusChange(item.id, 'Present')}
                          style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => handleStatusChange(item.id, 'Absent')}
                          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Absent
                        </button>
                        <button 
                          onClick={() => handleStatusChange(item.id, 'Late')}
                          style={{ background: '#eab308', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Late
                        </button>

                        <button 
                          onClick={() => startEdit(item)}
                          style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px', marginLeft: '6px' }}
                        >
                          ✏️ Edit
                        </button>

                        <button 
                          onClick={() => handleDelete(item.id)}
                          style={{ background: '#ffe4e6', color: '#e11d48', border: 'none', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={!isStudent ? "5" : "4"} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  ለ {selectedClass} በዳታቤዝ ውስጥ ምንም የመገኘት መረጃ የለም። እባክዎን "+ Add Student" የሚለውን በመጫን ይመዝግቡ።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;