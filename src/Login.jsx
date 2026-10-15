import React, { useState } from 'react';
import './Login.css';

const defaultUsers = [
  { id: 1, username: 'admin', role: 'Admin', password: '123' },
  { id: 2, username: 'teacher', role: 'Teacher', password: '456' },
  { id: 3, username: 'student', role: 'Student', password: '789' }
];

function Login({ setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // ከ localStorage ላይ የተመዘገቡትን ዩዘሮች ያነባል
    const saved = localStorage.getItem('system_users');
    const allUsers = saved ? JSON.parse(saved) : defaultUsers;

    // ያስገቡትን username, password እና role በትክክል የሚዛመድ ዩዘር መኖሩን ያረጋግጣል
    const matchedUser = allUsers.find(
      u => u.username.trim() === username.trim() &&
           u.password.trim() === password.trim() &&
           u.role === role
    );

    if (matchedUser) {
      // 1. ሚናውን (Role) በ localStorage ውስጥ በቋሚነት ማስቀመጥ (ይህ ዋናው ቁልፍ ነው!)
      localStorage.setItem('role', matchedUser.role);
      localStorage.setItem('userRole', matchedUser.role);

      // 2. React State ን ማዘመን
      if (setUserRole) {
        setUserRole(matchedUser.role);
      }
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">🎓</div>
          <h2>Elementary School</h2>
          <h3>Management System</h3>
          <p>Better Education • Brighter Future</p>
        </div>

        <h4>Login to Your Account</h4>

        {errorMessage && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '10px', 
            borderRadius: '6px', 
            fontSize: '13px', 
            marginBottom: '15px', 
            textAlign: 'center',
            fontWeight: '600',
            border: '1px solid #fca5a5'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span className="eye-icon">👁️</span>
          </div>

          <div className="input-group">
            <span className="icon">👤</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="login-footer">
          <a href="#forgot">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;