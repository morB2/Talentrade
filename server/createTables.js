// const mysql = require("mysql2");

// const con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "1234",
//   database: "TalentTrade",
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//     const alterTableQuery =
//     "ALTER TABLE users ADD COLUMN received_service_ids JSON;";
//   con.query(alterTableQuery, function (err, result) {
//     if (err) throw err;
//     console.log("Column added");
//   });

// });
// "ALTER TABLE users ADD COLUMN report_ids JSON;";
//   con.query(alterTableQuery, function (err, result) {
//     if (err) throw err;
//     console.log("Column added");
//   });
  //     const alterTableQuery =
  //   "INSERT INTO users (id, username, password, salt, email) VALUES (-1, 'deleted_user', '', '', '');";
  // con.query(alterTableQuery, function (err, result) {
  //   if (err) throw err;
  //   console.log("Column added");
  // });

  //   const alterTableQuery =
  //   "ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin') DEFAULT 'user';";
  // con.query(alterTableQuery, function (err, result) {
  //   if (err) throw err;
  //   console.log("Column added");
  // });
//   const dropColumnQuery = "ALTER TABLE users DROP COLUMN role;";
//   con.query(dropColumnQuery, function (err, result) {
//     if (err) throw err;
//     console.log("Column 'role' dropped");
//   });
//   // Next, add the 'role' column back with ENUM type and default value
//   const addColumnQuery =
//     "ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';";
//   con.query(addColumnQuery, function (err, result) {
//     if (err) throw err;
//     console.log(
//       "Column 'role' added with ENUM('user', 'admin') and default value 'user'"
//     );
//   });

//   // Describe the services table after creation
//   con.query("DESCRIBE users", function (err, results) {
//     if (err) throw err;
//     console.log("Data from services table:");
//     console.log(results);
//     con.end();
//   });
// });

// Create the services table
//   const createServicesTable = `



// const alterTableQuery =
//   "ALTER TABLE comments MODIFY COLUMN likes JSON DEFAULT '[]';";
// con.query(alterTableQuery, function (err, result) {
//   if (err) throw err;
//   console.log("Column added");
// });
// con.query(createServicesTable, function (err, result) {
//   if (err) throw err;
//   console.log("Services table created or already exists");

// const alterTableQuery = 'ALTER TABLE users ADD COLUMN salt VARCHAR(255) NOT NULL;';
//   con.query(alterTableQuery, function(err, result) {
//     if (err) throw err;
//     console.log('Column added');
//   });

// con.query("DESCRIBE users", function (err, results) {
//   if (err) throw err;
//   console.log("Data from users table:");
//   console.log(results);
// });

// con.query("SELECT * FROM comments;", function (err, results) {
//   if (err) throw err;
//   console.log("Data from users table:");
//   console.log(results);
// });

/*
 CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          salt VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          about TEXT,
          resume VARCHAR(255),
          profilePicture VARCHAR(255),
          phone VARCHAR(20),
          rating FLOAT DEFAULT 0
        )
*/

/*
CREATE TABLE IF NOT EXISTS services (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           userId INT NOT NULL,
//           type ENUM('request', 'offer') NOT NULL,
//           title VARCHAR(255) NOT NULL,
//           description TEXT NOT NULL,
//           category VARCHAR(255) NOT NULL,
//           subcategories JSON NOT NULL,
//           compensation TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//           FOREIGN KEY (userId) REFERENCES users(id)
//       )
 */
/*
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serviceId INT,
    userId INT,
    text TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serviceId) REFERENCES services(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);
 */
// CREATE TABLE IF NOT EXISTS ratings (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     rater_id INT NOT NULL,
//     rating FLOAT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (rater_id) REFERENCES users(id),
//     UNIQUE KEY unique_rating (user_id, rater_id)
// );

//    `;






























var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // Create TalentTrade database
  con.query("CREATE DATABASE IF NOT EXISTS TalentTrade", function (err, result) {
    if (err) throw err;
    console.log("Database created or already exists");
    
    // Switch to TalentTrade database
    con.changeUser({ database: 'TalentTrade' }, function (err) {
      if (err) throw err;

      // Create users table
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          salt VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          about TEXT,
          resume VARCHAR(255),
          profilePicture VARCHAR(255),
          phone VARCHAR(20),
          rating FLOAT DEFAULT 0,
          role ENUM('user', 'admin') DEFAULT 'user',
          report_ids JSON;
        )
      `;
      con.query(createUsersTable, function (err, result) {
        if (err) throw err;
        console.log("Users table created or already exists");

        // Insert default user for deleted users
        const insertDeletedUser = `
          INSERT INTO users (id, username, password, salt, email)
          VALUES (-1, 'deleted_user', '', '', '')
          ON DUPLICATE KEY UPDATE username='deleted_user'
        `;
        con.query(insertDeletedUser, function (err, result) {
          if (err) throw err;
          console.log("Default deleted_user inserted or already exists");
        });
      });

      // Create services table
      const createServicesTable = `
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          type ENUM('request', 'offer') NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(255) NOT NULL,
          subcategories JSON NOT NULL,
          compensation TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `;
      con.query(createServicesTable, function (err, result) {
        if (err) throw err;
        console.log("Services table created or already exists");
      });

      // Create comments table
      const createCommentsTable = `
        CREATE TABLE IF NOT EXISTS comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          serviceId INT,
          userId INT,
          text TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          likes JSON DEFAULT '[]',
          FOREIGN KEY (serviceId) REFERENCES services(id),
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `;
      con.query(createCommentsTable, function (err, result) {
        if (err) throw err;
        console.log("Comments table created or already exists");
      });

      // Create ratings table
      const createRatingsTable = `
        CREATE TABLE IF NOT EXISTS ratings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          rater_id INT NOT NULL,
          rating FLOAT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (rater_id) REFERENCES users(id),
          UNIQUE KEY unique_rating (user_id, rater_id)
        )
      `;
      con.query(createRatingsTable, function (err, result) {
        if (err) throw err;
        console.log("Ratings table created or already exists");
      });

    });
  });
});
