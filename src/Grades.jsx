import React, { useState, useEffect } from 'react';
import './Grades.css';

function Grades({ role }) {
  const [gradesList, setGradesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // ከ Login.jsx በ localStorage የተቀመጠውን Role ያነባል
  const detectUserRole = () => {
    if (role) return role;
    const storedRole = localStorage.getItem('role') || localStorage.getItem('userRole');
    return storedRole || 'Student';
  };

  const [userRole, setUserRole] = useState(detectUserRole);

  useEffect(() => {
    setUserRole(detectUserRole());
  }, [role]);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [exam1, setExam1] = useState('');
  const [exam2, setExam2] = useState('');
  const [finalExam, setFinalExam] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [editExam1, setEditExam1] = useState('');
  const [editExam2, setEditExam2] = useState('');
  const [editFinal, setEditFinal] = useState('');

  const fetchGrades = () => {
    fetch('http://localhost:5000/api/grades')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setGradesList(data))
      .catch((err) => console.error("Error fetching grades:", err));
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Student መሆኑን ማረጋገጥ
  const isStudent = userRole.toString().trim().toLowerCase() === 'student';

  // የ Class እና Subject ፊልተር
  const filteredGrades = gradesList.filter((item) => {
    const matchClass = selectedClass === 'All' || item.class_name === selectedClass;
    const matchSubject = selectedSubject === 'All' || item.subject_name === selectedSubject;
    return matchClass && matchSubject;
  });

  const handleAddGrade = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: studentName,
        class_name: selectedClass === 'All' ? 'Grade 3' : selectedClass,
        subject_name: selectedSubject === 'All' ? 'Mathematics' : selectedSubject,
        exam1: exam1 || 0,
        exam2: exam2 || 0,
        final: finalExam || 0
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('ውጤቱ በትክክል ተመዝግቧል!');
        setStudentName('');
        setExam1('');
        setExam2('');
        setFinalExam('');
        setShowAddForm(false);
        fetchGrades();
      })
      .catch((err) => console.error('Error adding grade:', err));
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setEditExam1(item.exam1);
    setEditExam2(item.exam2);
    setEditFinal(item.final);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/grades/${editingItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam1: editExam1,
        exam2: editExam2,
        final: editFinal
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('ውጤቱ በትክክል ተስተካክሏል!');
        setEditingItem(null);
        fetchGrades();
      })
      .catch((err) => console.error('Error updating grade:', err));
  };

  const handleDeleteGrade = (id) => {
    if (window.confirm('እርግጠኛ ነዎት ይህንን ውጤት ማጥፋት ይፈልጋሉ?')) {
      fetch(`http://localhost:5000/api/grades/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => {
          fetchGrades();
        })
        .catch((err) => console.error('Error deleting grade:', err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', fontWeight: 'bold' }}>
          {isStudent ? 'My Grades' : 'Grades Management'}
        </h2>
        
        {!isStudent && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {showAddForm ? 'Cancel' : '+ Add Grade'}
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && !isStudent && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '15px', color: '#334155' }}>Add New Student Grade</h3>
          <form onSubmit={handleAddGrade} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Student Full Name" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
              required 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }}
            />
            <input 
              type="number" 
              placeholder="Exam 1" 
              value={exam1} 
              onChange={(e) => setExam1(e.target.value)} 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '90px' }}
            />
            <input 
              type="number" 
              placeholder="Exam 2" 
              value={exam2} 
              onChange={(e) => setExam2(e.target.value)} 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '90px' }}
            />
            <input 
              type="number" 
              placeholder="Final" 
              value={finalExam} 
              onChange={(e) => setFinalExam(e.target.value)} 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '90px' }}
            />
            <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Save Grade
            </button>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingItem && !isStudent && (
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#0369a1' }}>Edit Grade: {editingItem.student_name}</h3>
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Exam 1</label>
              <input 
                type="number" 
                value={editExam1} 
                onChange={(e) => setEditExam1(e.target.value)} 
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '80px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Exam 2</label>
              <input 
                type="number" 
                value={editExam2} 
                onChange={(e) => setEditExam2(e.target.value)} 
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '80px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Final</label>
              <input 
                type="number" 
                value={editFinal} 
                onChange={(e) => setEditFinal(e.target.value)} 
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '80px' }}
              />
            </div>
            <div style={{ marginTop: '18px', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                Update
              </button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Card */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '6px' }}>Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="All">All Classes</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '6px' }}>Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: !isStudent ? '950px' : '750px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '14px' }}>
              <th style={{ padding: '16px' }}>No</th>
              <th style={{ padding: '16px' }}>Student Name</th>
              <th style={{ padding: '16px' }}>Class</th>
              <th style={{ padding: '16px' }}>Subject</th>
              <th style={{ padding: '16px' }}>Exam 1</th>
              <th style={{ padding: '16px' }}>Exam 2</th>
              <th style={{ padding: '16px' }}>Final</th>
              <th style={{ padding: '16px' }}>Total</th>
              <th style={{ padding: '16px' }}>Grade</th>
              {!isStudent && <th style={{ padding: '16px' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredGrades && filteredGrades.length > 0 ? (
              filteredGrades.map((item, index) => {
                // የሦስቱ ፈተናዎች ድምር (ወይም አማካይ እንደ አስፈላጊነቱ)
                const total = (Number(item.exam1) || 0) + (Number(item.exam2) || 0) + (Number(item.final) || 0);

                // በአዲሱ መስፈርት መሠረት የደረጃ ስሌት
                let letterGrade = 'F';
                if (total >= 90) letterGrade = 'A+';
                else if (total >= 85) letterGrade = 'A';
                else if (total >= 80) letterGrade = 'A-';
                else if (total >= 75) letterGrade = 'B+';
                else if (total >= 70) letterGrade = 'B';
                else if (total >= 65) letterGrade = 'B-';
                else if (total >= 60) letterGrade = 'C+';
                else if (total >= 50) letterGrade = 'C';
                else if (total >= 45) letterGrade = 'C-';
                else letterGrade = 'F';

                // የከለር አቀማመጥ (A/B ደረጃዎች አረንጓዴ፣ C ደረጃዎች ቢጫ፣ F ቀይ)
                let bgColor = '#fee2e2';
                let textColor = '#991b1b';

                if (letterGrade.startsWith('A') || letterGrade.startsWith('B')) {
                  bgColor = '#dcfce7';
                  textColor = '#166534';
                } else if (letterGrade.startsWith('C')) {
                  bgColor = '#fef9c3';
                  textColor = '#854d0e';
                }

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc', color: '#334155' }}>
                    <td style={{ padding: '16px' }}>{index + 1}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{item.student_name}</td>
                    <td style={{ padding: '16px' }}>{item.class_name}</td>
                    <td style={{ padding: '16px' }}>{item.subject_name}</td>
                    <td style={{ padding: '16px' }}>{item.exam1}</td>
                    <td style={{ padding: '16px' }}>{item.exam2}</td>
                    <td style={{ padding: '16px' }}>{item.final}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{total.toFixed(1)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        background: bgColor,
                        color: textColor,
                        fontWeight: 'bold'
                      }}>
                        {letterGrade}
                      </span>
                    </td>
                    {!isStudent && (
                      <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => startEdit(item)}
                          style={{ background: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#0369a1' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteGrade(item.id)}
                          style={{ background: '#ffe4e6', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
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
                <td colSpan={!isStudent ? "10" : "9"} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  ምንም የውጤት መረጃ በዳታቤዝ ውስጥ አልተገኘም።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Grades;