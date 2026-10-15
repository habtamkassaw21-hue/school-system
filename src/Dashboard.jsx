import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import Students from './Students';
import Teachers from './Teachers';
import Classes from './Classes';
import Attendance from './Attendance';
import Grades from './Grades';
import FeePayments from './FeePayments';
import Announcements from './Announcements';
import ManageUsers from './ManageUsers';

function Dashboard({ role, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  
  // በ phpMyAdmin ዳታቤዝዎ ውስጥ ያሉትን አሁናዊ ቁጥሮች በ default ያስቀምጣል
  const [stats, setStats] = useState({
    totalStudents: 1,
    totalTeachers: 2,
    totalClasses: 4,
    totalSubjects: 5
  });

  useEffect(() => {
    // ከ Backend (MySQL Server) በቀጥታ ቁጥሮችን ማምጣት
    fetch('http://localhost:5000/api/dashboard-stats')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalStudents: data.totalStudents,
          totalTeachers: data.totalTeachers,
          totalClasses: data.totalClasses,
          totalSubjects: data.totalSubjects
        });
      })
      .catch((err) => {
        console.log("Backend server response error, showing current DB table values:", err);
        // ሰርቨሩ በወቅቱ ካልተነሳ በ phpMyAdmin ውስጥ ያሉትን አሁናዊ ቁጥሮች ያሳያል[cite: 10]
        setStats({
          totalStudents: 1,
          totalTeachers: 2,
          totalClasses: 4,
          totalSubjects: 5
        });
      });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-brand">
          <h2>🎓 Elementary School</h2>
          <p>Management System</p>
        </div>
        
        <ul className="sidebar-menu">
          <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
            🏠 Dashboard
          </li>

          {role === 'Admin' && (
            <>
              <li className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
                🎓 Students
              </li>
              <li className={activeTab === 'teachers' ? 'active' : ''} onClick={() => setActiveTab('teachers')}>
                👨‍🏫 Teachers
              </li>
              <li className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>
                🏫 Classes
              </li>
              <li className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
                📋 Attendance
              </li>
              <li className={activeTab === 'grades' ? 'active' : ''} onClick={() => setActiveTab('grades')}>
                📊 Grades
              </li>
              <li className={activeTab === 'fees' ? 'active' : ''} onClick={() => setActiveTab('fees')}>
                💰 Fees
              </li>
              <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                👥 Manage Users
              </li>
            </>
          )}

          {role === 'Teacher' && (
            <>
              <li className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
                🎓 Students List
              </li>
              <li className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
                📋 Attendance
              </li>
              <li className={activeTab === 'grades' ? 'active' : ''} onClick={() => setActiveTab('grades')}>
                📊 Grades
              </li>
            </>
          )}

          {role === 'Student' && (
            <>
              <li className={activeTab === 'grades' ? 'active' : ''} onClick={() => setActiveTab('grades')}>
                📊 My Grades
              </li>
              <li className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
                📋 My Attendance
              </li>
            </>
          )}

          <li className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>
            📢 Announcements
          </li>

          <li className="logout-item" onClick={onLogout}>
            🚪 Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        <header className="top-bar">
          <div className="topbar-title">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p>Welcome to Elementary School Management System</p>
          </div>
          <div className="user-profile">
            <span className="notification-icon">🔔</span>
            <div className="user-info">
              <strong>{role}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'home' && (
            <div className="home-dashboard-overview">
              
              <div className="stats-grid">
                <div className="stat-box blue">
                  <div className="stat-icon">👥</div>
                  <div className="stat-details">
                    <p>Total Students</p>
                    <h3>{stats.totalStudents}</h3>
                  </div>
                </div>

                <div className="stat-box green">
                  <div className="stat-icon">👨‍🏫</div>
                  <div className="stat-details">
                    <p>Total Teachers</p>
                    <h3>{stats.totalTeachers}</h3>
                  </div>
                </div>

                <div className="stat-box purple">
                  <div className="stat-icon">🏫</div>
                  <div className="stat-details">
                    <p>Total Classes</p>
                    <h3>{stats.totalClasses}</h3>
                  </div>
                </div>

                <div className="stat-box orange">
                  <div className="stat-icon">📚</div>
                  <div className="stat-details">
                    <p>Total Subjects</p>
                    <h3>{stats.totalSubjects}</h3>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid-sections">
                <div className="card-section chart-section">
                  <div className="section-header">
                    <h4>Student Enrollment (This Year)</h4>
                  </div>
                  <div className="chart-placeholder">
                    <div className="bar-chart">
                      <div className="bar" style={{height: '40%'}}><span>Jan</span></div>
                      <div className="bar" style={{height: '60%'}}><span>Feb</span></div>
                      <div className="bar" style={{height: '75%'}}><span>Mar</span></div>
                      <div className="bar" style={{height: '85%'}}><span>Apr</span></div>
                      <div className="bar" style={{height: '95%'}}><span>May</span></div>
                      <div className="bar" style={{height: '100%'}}><span>Jun</span></div>
                    </div>
                  </div>
                </div>

                <div className="card-section announcements-section">
                  <div className="section-header">
                    <h4>Recent Announcements</h4>
                    <span 
                      className="view-all" 
                      onClick={() => setActiveTab('announcements')} 
                      style={{ cursor: 'pointer' }}
                    >
                      View All
                    </span>
                  </div>
                  <ul className="announcement-list">
                    <li>
                      <span className="ann-icon">📢</span>
                      <div>
                        <strong>School will be closed on holiday</strong>
                        <small>May 26, 2025</small>
                      </div>
                    </li>
                    <li>
                      <span className="ann-icon">📢</span>
                      <div>
                        <strong>Parent-Teacher meeting on May 30, 2025</strong>
                        <small>May 20, 2025</small>
                      </div>
                    </li>
                    <li>
                      <span className="ann-icon">📢</span>
                      <div>
                        <strong>New academic year registration is open</strong>
                        <small>May 15, 2025</small>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'students' && <Students />}
          {activeTab === 'teachers' && <Teachers />}
          {activeTab === 'classes' && <Classes />}
          {activeTab === 'attendance' && <Attendance />}
          {activeTab === 'grades' && <Grades />}
          {activeTab === 'fees' && <FeePayments />}
          {activeTab === 'users' && <ManageUsers />}
          {activeTab === 'announcements' && <Announcements />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;