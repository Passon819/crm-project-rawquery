const mariadb = require('mariadb');

// Replace these values with your database connection details
const pool = mariadb.createPool({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
});

const dataFromNodeJS = [['@777', 'tttt', 'active'], ['@999', 'kooo', 'active']];

async function processData() {
  let conn;
  try {
    conn = await pool.getConnection();

    // Retrieve data from the database
    const dbResults = await conn.query('SELECT id, name, status FROM your_table_name');
    const existingData = dbResults.map((row) => [row.id, row.name, row.status]);

    // Update or insert data
    for (const nodeData of dataFromNodeJS) {
      const matchingRow = existingData.find((row) => row[0] === nodeData[0]); // เอาข้อมูลทุกแถวของคอลัมน์ basic_id ในฐานข้อมูล มาหาว่าตรงกับ basic_id (dataFromNodeJS) ถ้าตรงกัน return ข้อมูลของดาต้าเบส ถ้าไม่ตรง return undefined

      if (matchingRow) {
        // Update existing data
        if (matchingRow[1] !== nodeData[1]) {
          await conn.query(
            'UPDATE your_table_name SET name = ?, status = ? WHERE id = ?',
            [nodeData[1], 'active', matchingRow[0]]
          );
        }
      } else {
        // Insert new data
        await conn.query('INSERT INTO your_table_name (id, name, status) VALUES (?, ?, ?)', nodeData);
      }
    }

    // Update data in the database that doesn't match the data from Node.js to 'unactive'
    for (const row of existingData) {
      const matchingNodeData = dataFromNodeJS.find((nodeData) => nodeData[0] === row[0]);

      if (!matchingNodeData) {
        await conn.query('UPDATE your_table_name SET status = ? WHERE id = ?', ['unactive', row[0]]);
      }
    }
  } catch (err) {
    console.error('Error: ', err);
  } finally {
    if (conn) {
      conn.release();
    }
  }

  // Close the connection pool
  pool.end();
}

// Call the function to start the process
processData();
