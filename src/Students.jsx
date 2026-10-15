import React, { useState, useEffect } from 'react';
import './Students.css';

function Students() {
  const [viewMode, setViewMode] = useState('list'); 
  const [students, setStudents] = useState([]);

  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // ከዳታቤዝ መረጃዎችን ለማምጣት
  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched students:", data);
        setStudents(data);
      })
      .catch((err) => console.log("Error fetching students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // አዲስ ተማሪ ወደ ዳታቤዝ ለመላክ
  const handleSaveStudent = (e) => {
    e.preventDefault();

    const newStudentData = {
      Full_name: fullName,
      grade: grade,
      age: age ? parseInt(age) : 10,
      gender: gender
    };

    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudentData)
    })
      .then((res) => res.json())
      .then((data) => {
        alert('ተማሪው በትክክል ወደ ዳታቤዝ ተመዝግቧል!');
        fetchStudents();
        setFullName('');
        setGrade('');
        setAge('');
        setGender('');
        setViewMode('list');
      })
      .catch((err) => {
        console.error('Error saving student:', err);
        alert('ተማሪውን መመዝገብ አልተቻለም።');
      });
  };

  return (
    <div className="students-container" style={{ padding: '20px' }}>
      {viewMode === 'list' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>የተማሪዎች ዝርዝር (ከዳታቤዝ)</h3>
            <button
              onClick={() => setViewMode('add')}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Add Student
            </button>
          </div>

          <table className="user-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Full Name</th>
                <th style={{ padding: '12px 16px' }}>Grade</th>
                <th style={{ padding: '12px 16px' }}>Age</th>
                <th style={{ padding: '12px 16px' }}>Gender</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>{student.id}</td>
                    <td style={{ padding: '12px 16px' }}><strong>{student.Full_name}</strong></td>
                    <td style={{ padding: '12px 16px' }}>{student.grade}</td>
                    <td style={{ padding: '12px 16px' }}>{student.age}</td>
                    <td style={{ padding: '12px 16px' }}>{student.gender}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    ምንም ተማሪ በዳታቤዝ ውስጥ አልተገኘም።
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '24px', color: '#0f172a', fontSize: '22px' }}>Add New Student</h2>
          
          <form onSubmit={handleSaveStudent}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              <div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}>Grade *</label>
                  <select 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}
                  >
                    <option value="">Select grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}>Age *</label>
                  <input 
                    type="number" 
                    placeholder="Enter age" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}>Gender *</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                type="button" 
                onClick={() => setViewMode('list')}
                style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 22px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Students;