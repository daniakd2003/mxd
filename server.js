const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./db'); // Підключення до бази даних

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Налаштування для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const userId = req.body.userId || req.body.username;
    cb(null, `${userId}_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Реєстрація
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (row) {
      return res.status(400).json({ error: 'Username already exists' });
    } else {
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ success: true });
      });
    }
  });
});

// Логін
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (row) {
      res.json({ success: true, user: row });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// Створення профілю
app.post('/createProfile', upload.single('profilePicture'), (req, res) => {
  const { userId, firstName, lastName, bio } = req.body;
  const profilePicture = `/uploads/${req.file.filename}`;
  db.run("UPDATE users SET firstName = ?, lastName = ?, bio = ?, profilePicture = ? WHERE id = ?", [firstName, lastName, bio, profilePicture, userId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ success: true, user: row });
    });
  });
});

// Створення публікації
app.post('/createPost', upload.single('postImage'), (req, res) => {
  const { userId, description } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;
  db.run("INSERT INTO posts (userId, imageUrl, description, likes) VALUES (?, ?, ?, ?)", [userId, imageUrl, description, 0], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// Отримання профілю користувача
app.get('/getProfile/:userId', (req, res) => {
  const userId = req.params.userId;
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(row);
  });
});

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API для перевірки вмісту бази даних
app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/posts', (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
