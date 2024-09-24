const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "TalentTrade",
  waitForConnections: true, // Wait for connections if none are available
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0 // No limit for the number of queued connection requests
});

// Export the pool as a promise-based interface
module.exports = pool.promise();
