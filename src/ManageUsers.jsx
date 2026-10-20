import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import API_BASE_URL from './api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Student');
  const [editingId, setEditingId] = useState(null);

  // ከዳታቤዝ ዩዘሮችን ለማምጣት
  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUsername && newPassword) {
      if (editingId !== null) {
        // ዩዘርን ማስተካከል (PUT)
        fetch(`${API_BASE_URL}/api/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
        })
          .then((res) => res.json())
          .then(() => {
            alert(`User '${newUsername}' updated successfully!`);
            fetchUsers();
            handleCancelEdit();
          })
          .catch((err) => console.error('Error updating user:', err));
      } else {
        // አዲስ ዩዘር መፍጠር (POST)
        const newUser = {
          username: newUsername,
          password: newPassword,
          role: newRole
        };

        fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })
          .then((res) => res.json())
          .then(() => {
            alert(`User '${newUsername}' created successfully!`);
            fetchUsers();
            setNewUsername('');
            setNewPassword('');
            setNewRole('Student');
          })
          .catch((err) => console.error('Error creating user:', err));
      }
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
      fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => {
          fetchUsers();
        })
        .catch((err) => console.error('Error deleting user:', err));
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
            {users && users.length > 0 ? (
              users.map((u) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  ምንም ዩዘር በዳታቤዝ ውስጥ አልተገኘም።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;