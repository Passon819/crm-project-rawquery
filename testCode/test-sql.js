const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Connect to the database
connection.connect();

// Your data
const inputData = [['@777', 'tttt'], ['@888', 'jooo'], ['@999', 'kooo']];

// Iterate through the input data
inputData.forEach(([id, name]) => {
  // Check if the ID already exists in the database
  const query = `SELECT * FROM your_table_name WHERE id = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      throw error;
    }

    // If the ID exists, update the information
    if (results.length > 0) {
      const updateQuery = `UPDATE your_table_name SET name = ? WHERE id = ?`;

      connection.query(updateQuery, [name, id], (updateError, updateResults) => {
        if (updateError) {
          throw updateError;
        }
        console.log(`Updated row with ID ${id}`);
      });
    } else {
      // If the ID doesn't exist, insert the data
      const insertQuery = `INSERT INTO your_table_name (id, name) VALUES (?, ?)`;

      connection.query(insertQuery, [id, name], (insertError, insertResults) => {
        if (insertError) {
          throw insertError;
        }
        console.log(`Inserted row with ID ${id}`);
      });
    }
  });
});

// Close the connection
connection.end();