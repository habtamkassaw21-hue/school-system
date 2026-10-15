import React, { useState, useEffect } from 'react';
import './Subjects.css';

function Subjects() {
  const [subjectsList, setSubjectsList] = useState([]);
  const [subjectName, setSubjectName] = useState('');

  const fetchSubjects = () => {
    fetch('http://localhost:5000/api/subjects')
      .then((res) => res.json())
      .then((data) => setSubjectsList(data))
      .catch((err) => console.error("Error fetching subjects:", err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject_name: subjectName }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('ትምህርቱ በትክክል ተመዝግቧል!');
        setSubjectName('');
        fetchSubjects();
      })
      .catch((err) => {
        console.error('Error saving subject:', err);
        alert('ማስቀመጥ አልተቻለም።');
      });
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('እርግጠኛ ነዎት ይህንን ትምህርት ማጥፋት ይፈልጋሉ?')) {
      fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => {
          fetchSubjects();
        })
        .catch((err) => console.error('Error deleting subject:', err));
    }
  };

  return (
    <div className="subjects-container">
      <h2 className="subjects-header">Subjects Management</h2>

      {/* Add Subject Form */}
      <div className="subjects-form-card">
        <form onSubmit={handleAddSubject} className="subjects-form">
          <input 
            type="text" 
            placeholder="Enter subject name (e.g. Mathematics)" 
            value={subjectName} 
            onChange={(e) => setSubjectName(e.target.value)} 
            required 
            className="subjects-input"
          />
          <button type="submit" className="subjects-btn">
            + Add Subject
          </button>
        </form>
      </div>

      {/* Subjects List Table */}
      <div className="subjects-table-card">
        <table className="subjects-table">
          <thead>
            <tr>
              <th className="subjects-th">No</th>
              <th className="subjects-th">Subject Name</th>
              <th className="subjects-th">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjectsList && subjectsList.length > 0 ? (
              subjectsList.map((sub, index) => (
                <tr key={sub.id} className="subjects-tr">
                  <td className="subjects-td">{index + 1}</td>
                  <td className="subjects-td-name">{sub.subject_name}</td>
                  <td className="subjects-td">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteSubject(sub.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  ምንም ትምህርት በዳታቤዝ ውስጥ አልተገኘም።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Subjects;