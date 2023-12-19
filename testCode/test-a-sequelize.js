const { Sequelize, DataTypes } = require('sequelize');

// Replace these values with your database connection details
const sequelize = new Sequelize('your_database_name', 'your_database_user', 'your_database_password', {
  host: 'your_database_host',
  dialect: 'mariadb', // or 'mysql'
});

// Define your model
const YourModel = sequelize.define('YourModel', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

const dataFromNodeJS = [['@777', 'tttt', 'active'], ['@999', 'kooo', 'active']];

async function processData() {
  try {
    // Sync the model with the database
    await sequelize.sync();

    // Retrieve data from the database
    const existingData = await YourModel.findAll();

    // Update or insert data
    for (const nodeData of dataFromNodeJS) {
      const matchingRow = existingData.find((row) => row.id === nodeData[0]);

      if (matchingRow) {
        // Update existing data
        if (matchingRow.name !== nodeData[1]) {
          await matchingRow.update({ name: nodeData[1], status: 'active' });
        }
      } else {
        // Insert new data
        await YourModel.create({ id: nodeData[0], name: nodeData[1], status: 'active' });
      }
    }

    // Update data in the database that doesn't match the data from Node.js to 'unactive'
    for (const row of existingData) {
      const matchingNodeData = dataFromNodeJS.find((nodeData) => nodeData[0] === row.id);

      if (!matchingNodeData) {
        await row.update({ status: 'unactive' });
      }
    }
  } catch (err) {
    console.error('Error: ', err);
  } finally {
    // Close the Sequelize connection
    await sequelize.close();
  }
}

// Call the function to start the process
processData();
