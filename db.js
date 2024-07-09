const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Створення або підключення до бази даних
const dbPath = path.resolve('D:/mxd/mydatabase.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, profilePicture TEXT, firstName TEXT, lastName TEXT, bio TEXT)", (err) => {
      if (err) {
        console.error('Error creating users table', err);
      }
    });
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, imageUrl TEXT, description TEXT, likes INTEGER)", (err) => {
      if (err) {
        console.error('Error creating posts table', err);
      }
    });
  }
});

module.exports = db;
