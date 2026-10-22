const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS ማስተካከያ
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads Folder Config
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database Connection Error:', err);
    return;
  }
  console.log('Successfully Connected to MySQL Database!');
});

// --- STATIC FRONTEND FILES (React Build ን በ Render ለማቅረብ) ---
// `build` ፎልደርህ በ `src` ውስጥ ስለሆነ
app.use(express.static(path.join(__dirname, 'build')));

// --- DASHBOARD STATS API ---
app.get('/api/dashboard-stats', (req, res) => {
  db.query('SELECT COUNT(*) as count FROM students', (err, studentResult) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query('SELECT COUNT(*) as count FROM teachers', (err, teacherResult) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query('SELECT COUNT(*) as count FROM classes', (err, classResult) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('SELECT COUNT(*) as count FROM subjects', (err, subjectResult) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            totalStudents: studentResult[0].count,
            totalTeachers: teacherResult[0].count,
            totalClasses: classResult[0].count,
            totalSubjects: subjectResult[0].count
          });
        });
      });
    });
  });
});

// --- STUDENTS API ---
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/students', (req, res) => {
  const { Full_name, grade, age, gender } = req.body;
  const sql = 'INSERT INTO students (Full_name, grade, age, gender) VALUES (?, ?, ?, ?)';
  db.query(sql, [Full_name, grade, age || 10, gender], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student added successfully!', id: result.insertId });
  });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted successfully!' });
  });
});

// --- TEACHERS API ---
app.get('/api/teachers', (req, res) => {
  db.query('SELECT * FROM teachers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/teachers', upload.single('photo'), (req, res) => {
  const { name, subject, phone } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO teachers (name, subject, phone, photo) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, subject, phone, photo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Teacher added successfully!', id: result.insertId });
  });
});

app.put('/api/teachers/:id', upload.single('photo'), (req, res) => {
  const { id } = req.params;
  const { name, subject, phone } = req.body;
  
  if (req.file) {
    const photo = `/uploads/${req.file.filename}`;
    const sql = 'UPDATE teachers SET name = ?, subject = ?, phone = ?, photo = ? WHERE id = ?';
    db.query(sql, [name, subject, phone, photo, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Teacher updated successfully!' });
    });
  } else {
    const sql = 'UPDATE teachers SET name = ?, subject = ?, phone = ? WHERE id = ?';
    db.query(sql, [name, subject, phone, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Teacher updated successfully!' });
    });
  }
});

app.delete('/api/teachers/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM teachers WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Teacher deleted successfully!' });
  });
});

// --- CLASSES API ---
app.get('/api/classes', (req, res) => {
  const sql = `
    SELECT classes.*, COUNT(students.id) AS student_count 
    FROM classes 
    LEFT JOIN students ON students.grade = classes.class_name 
    GROUP BY classes.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/classes', (req, res) => {
  const { class_name } = req.body;
  const sql = 'INSERT INTO classes (class_name) VALUES (?)';
  db.query(sql, [class_name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Class added successfully!', id: result.insertId });
  });
});

app.put('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const { class_name } = req.body;
  const sql = 'UPDATE classes SET class_name = ? WHERE id = ?';
  db.query(sql, [class_name, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Class updated successfully!' });
  });
});

app.delete('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM classes WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Class deleted successfully!' });
  });
});

// --- SUBJECTS API ---
app.get('/api/subjects', (req, res) => {
  db.query('SELECT * FROM subjects', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/subjects', (req, res) => {
  const { subject_name } = req.body;
  const sql = 'INSERT INTO subjects (subject_name) VALUES (?)';
  db.query(sql, [subject_name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Subject added successfully!', id: result.insertId });
  });
});

app.delete('/api/subjects/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM subjects WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Subject deleted successfully!' });
  });
});

// --- GRADES API ---
app.get('/api/grades', (req, res) => {
  db.query('SELECT * FROM grades', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/grades', (req, res) => {
  const { student_name, class_name, subject_name, exam1, exam2, final } = req.body;
  const sql = 'INSERT INTO grades (student_name, class_name, subject_name, exam1, exam2, final) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [student_name, class_name, subject_name, exam1 || 0, exam2 || 0, final || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Grade added successfully!', id: result.insertId });
  });
});

app.put('/api/grades/:id', (req, res) => {
  const { id } = req.params;
  const { exam1, exam2, final } = req.body;
  const sql = 'UPDATE grades SET exam1 = ?, exam2 = ?, final = ? WHERE id = ?';
  db.query(sql, [exam1, exam2, final, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Grade updated successfully!' });
  });
});

// --- ATTENDANCE API ---
app.get('/api/attendance', (req, res) => {
  const className = req.query.class;
  let query = 'SELECT * FROM attendance';
  let params = [];
  
  if (className) {
    query += ' WHERE class_name = ?';
    params.push(className);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/attendance', (req, res) => {
  const { student_name, class_name, status } = req.body;
  const sql = 'INSERT INTO attendance (student_name, class_name, status) VALUES (?, ?, ?)';
  db.query(sql, [student_name, class_name, status || 'Present'], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Attendance added successfully!', id: result.insertId });
  });
});

app.put('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  const { student_name, status, class_name } = req.body;
  
  let sql, params;
  if (student_name) {
    sql = 'UPDATE attendance SET student_name = ?, status = ?, class_name = ? WHERE id = ?';
    params = [student_name, status, class_name, id];
  } else {
    sql = 'UPDATE attendance SET status = ? WHERE id = ?';
    params = [status, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Attendance updated successfully!' });
  });
});

app.delete('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM attendance WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Attendance deleted successfully!' });
  });
});

// --- ANNOUNCEMENTS API ---
app.get('/api/announcements', (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/announcements', (req, res) => {
  const { title, content, date } = req.body;
  const sql = 'INSERT INTO announcements (title, content, date) VALUES (?, ?, ?)';
  db.query(sql, [title, content, date || new Date().toLocaleDateString()], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Announcement posted successfully!', id: result.insertId });
  });
});

app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM announcements WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Announcement deleted successfully!' });
  });
});

// --- FRONTEND ROUTING WILDCARD ---
// ከ API ውጭ ያሉ ማናቸውንም የብራውዘር ጥያቄዎች ወደ React's index.html እንዲመሩ ማድረግ
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// SERVER LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});