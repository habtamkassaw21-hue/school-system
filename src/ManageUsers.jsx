import React, { useState, useEffect } from 'react';
import './ManageUsers.css';

// ነባሪ ዩዘሮች
const defaultUsers = [
  { id: 1, username: 'admin', role: 'Admin', password: '123' },
  { id: 2, username: 'teacher', role: 'Teacher', password: '456' },
  { id: 3, username: 'student', role: 'Student', password: '789' }
];

function ManageUsers() {
  // ከ localStorage መረጃውን ያነባል፤ ከሌለ defaultUsers ይመልሳል
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('system_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Student');
  const [editingId, setEditingId] = useState(null);

  // ዝርዝሩ በተቀየረ ቁጥር localStorage ውስጥ ያድሳል
  useEffect(() => {
    localStorage.setItem('system_users', JSON.stringify(users));
  }, [users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUsername && newPassword) {
      if (editingId !== null) {
        setUsers(users.map(u => u.id === editingId ? { ...u, username: newUsername, password: newPassword, role: newRole } : u));
        alert(`User '${newUsername}' updated successfully!`);
        setEditingId(null);
      } else {
        const newUser = {
          id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
          username: newUsername,
          role: newRole,
          password: newPassword
        };
        setUsers([...users, newUser]);
        alert(`User '${newUsername}' created successfully!`);
      }
      setNewUsername('');
      setNewPassword('');
      setNewRole('Student');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setNewUsername(user.username);
    setNewPassword(user.password);
    setNewRole(user.role);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewUsername('');
    setNewPassword('');
    setNewRole('Student');
  };

  return (
    <div className="manage-users-container">
      <h3>Manage System Users (Admin Only)</h3>

      <div className="form-card">
        <h4>{editingId !== null ? 'Edit User' : 'Create New User'}</h4>
        <form onSubmit={handleSubmit} className="user-form">
          <input 
            type="text" 
            placeholder="Username" 
            value={newUsername} 
            onChange={(e) => setNewUsername(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
          <button type="submit" className="add-btn" style={{ background: editingId !== null ? '#22c55e' : '#2563eb' }}>
            {editingId !== null ? 'Update User' : 'Create User'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={handleCancelEdit} style={{ background: '#64748b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="table-card">
        <h4>Existing System Users List</h4>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Password</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td><strong>{u.role}</strong></td>
                <td>{u.password}</td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleEdit(u)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;