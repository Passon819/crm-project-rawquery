const mysql = require('mysql');

// Replace these values with your database connection details
const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
});

const dataFromNodeJS = [['@777', 'tttt', 'active'], ['@999', 'kooo', 'active']];

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to the database');

  // Start processing data
  processData();
});

function processData() {
  // Retrieve data from the database
  connection.query('SELECT id, name FROM your_table_name', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      connection.end();
      return;
    }

    const existingData = results.map((row) => [row.id, row.name, 'active']);

    // Update or insert data
    dataFromNodeJS.forEach((nodeData) => {
      const matchingRow = existingData.find((row) => row[0] === nodeData[0]);

      if (matchingRow) {
        // Update existing data
        if (matchingRow[1] !== nodeData[1]) {
          connection.query(
            'UPDATE your_table_name SET name = ?, status = ? WHERE id = ?',
            [nodeData[1], 'active', matchingRow[0]],
            (updateErr) => {
              if (updateErr) {
                console.error('Error updating data:', updateErr);
              }
            }
          );
        }
      } else {
        // Insert new data
        connection.query(
          'INSERT INTO your_table_name (id, name, status) VALUES (?, ?, ?)',
          nodeData,
          (insertErr) => {
            if (insertErr) {
              console.error('Error inserting data:', insertErr);
            }
          }
        );
      }
    });

    // Update data in the database that doesn't match the data from Node.js to 'unactive'
    existingData.forEach((row) => {
      const matchingNodeData = dataFromNodeJS.find((nodeData) => nodeData[0] === row[0]);

      if (!matchingNodeData) {
        connection.query(
          'UPDATE your_table_name SET status = ? WHERE id = ?',
          ['unactive', row[0]],
          (updateErr) => {
            if (updateErr) {
              console.error('Error updating data:', updateErr);
            }
          }
        );
      }
    });

    // Close the database connection
    connection.end();
  });
}
