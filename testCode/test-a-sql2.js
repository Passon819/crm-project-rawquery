const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
});

// Sample data from Node.js
const nodeData = [['@777', 'tttt', 'active'], ['@999', 'kooo', 'active']];

// Function to update or insert data
async function updateOrInsertData(data) {
  // Iterate through each row in the nodeData
  for (const [id, name, status] of data) {
    // Check if the ID exists in the database
    const [existingRow] = await connection.promise().query('SELECT * FROM your_table_name WHERE id = ?', [id]);

    if (existingRow.length > 0) {
      // If the ID exists, update the information
      await connection.promise().query('UPDATE your_table_name SET name = ?, status = ? WHERE id = ?', [name, status, id]);
    } else {
      // If the ID does not exist, insert the data
      await connection.promise().query('INSERT INTO your_table_name (id, name, status) VALUES (?, ?, ?)', [id, name, status]);
    }
  }

  // Update data in the database that doesn't match data in nodeData to 'unactive'
  await connection.promise().query('UPDATE your_table_name SET status = ? WHERE id NOT IN (?)', ['unactive', data.map(row => row[0])]);
}

// Call the function with the sample data
updateOrInsertData(nodeData)
  .then(() => {
    console.log('Data updated or inserted successfully.');
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    // Close the database connection
    connection.end();
  });
