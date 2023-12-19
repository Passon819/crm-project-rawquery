const mariadb = require('mariadb');

// Create a MariaDB connection pool
const pool = mariadb.createPool({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
  port: 'your_database_port', // Specify the port if it's not the default (3306)
  connectionLimit: 5 // Adjust the connection pool size as needed
});

// Your data
const inputData = [['@777', 'tttt'], ['@888', 'jooo'], ['@999', 'kooo']];

// Use a function to encapsulate the asynchronous logic
async function processInputData() {
  // Get a connection from the pool
  let conn;
  try {
    conn = await pool.getConnection();

    // Iterate through the input data
    for (const [id, name] of inputData) {
      // Check if the ID already exists in the database
      const rows = await conn.query(`SELECT * FROM your_table_name WHERE id = ?`, [id]);

      // If the ID exists, update the information
      if (rows.length > 0) {
        await conn.query(`UPDATE your_table_name SET name = ? WHERE id = ?`, [name, id]);
        console.log(`Updated row with ID ${id}`);
      } else {
        // If the ID doesn't exist, insert the data
        await conn.query(`INSERT INTO your_table_name (id, name) VALUES (?, ?)`, [id, name]);
        console.log(`Inserted row with ID ${id}`);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
}

// Call the function to process the input data
processInputData()
  .then(() => {
    // Close the connection pool when done
    pool.end();
  })
  .catch((error) => {
    console.error(error);
    // Close the connection pool in case of an error
    if (pool) pool.end();
  });
