const db = require('./database.service')
const poolConnection = require('../configs/database').mariaDBCreatePool();
const utils = require('../utils/format-column-name.util');

const methods = {

    async findAll() {
        const result = await db.query('SELECT * FROM account_list');
        console.log(`All Account: ${result}`);
        return result;
    },

    async importAccount(req) {
        // **req.body is array of object [{"Basic ID":"@888","Display name":"a"},{"Basic ID":"@999","Display name":"b"}]
        const data = req.body

        // Object.keys() return array of key/value
        // [{"Basic ID":"@888","Display name":"a"},...]  ==>  ["Basic ID", "Display name"]
        const keys = Object.keys(data[0]);
        const formatKeysData = utils.formatColumnName(keys);
        console.log('FormatColumnName =>', formatKeysData);

        // array object to array array that value
        // [{"Basic ID":"@888","Display name":"a"},...]  ==>  [["@888","a"],...]
        const transformedValueData = data.map((obj) => {
            const values = Object.values(obj);
            return values;
        });
        console.log('Transformed value Result =>', transformedValueData);

        const processResult = await specialMethod.processImportAccount(transformedValueData, formatKeysData);
        console.log('ProcessResult =>', processResult);
        return processResult;
    }

}

const specialMethod = {

    async processImportAccount(dataFromNodeJS, formatKeysData) {
        let conn;
        try {
            conn = await poolConnection.getConnection();

            // Start Transaction
            await conn.beginTransaction();

            const createTableResult_main = await conn.query(
                `CREATE TABLE IF NOT EXISTS account_list (
                    ${formatKeysData[0]} DATETIME,
                    ${formatKeysData[1]} VARCHAR(15),
                    ${formatKeysData[2]} VARCHAR(100),
                    ${formatKeysData[3]} VARCHAR(10),
                    ${formatKeysData[4]} VARCHAR(30),
                    ${formatKeysData[5]} VARCHAR(10),
                    ${formatKeysData[6]} VARCHAR(10),
                    ${formatKeysData[7]} VARCHAR(15),
                    ${formatKeysData[8]} VARCHAR(10),
                    ${formatKeysData[9]} DATETIME,
                    ${formatKeysData[10]} DATETIME,
                    ${formatKeysData[11]} VARCHAR(15),
                    ${formatKeysData[12]} VARCHAR(15),
                    ${formatKeysData[13]} DATETIME,
                    ${formatKeysData[14]} DATETIME,
                    ${formatKeysData[15]} VARCHAR(50),
                    ${formatKeysData[16]} VARCHAR(50),
                    ${formatKeysData[17]} VARCHAR(50),
                    ${formatKeysData[18]} VARCHAR(15),
                    ${formatKeysData[19]} DATETIME,
                    ${formatKeysData[20]} VARCHAR(100),
                    ${formatKeysData[21]} VARCHAR(100),
                    ${formatKeysData[22]} INT,
                    ${formatKeysData[23]} INT,
                    ${formatKeysData[24]} DATETIME,
                    ${formatKeysData[25]} DATETIME,
                    ${formatKeysData[26]} VARCHAR(10),
                    ${formatKeysData[27]} VARCHAR(10),
                    PRIMARY KEY (${formatKeysData[1]})
                );`
            );
            console.log('Create Table(account_list) Result =>', createTableResult_main);

            const createTableResult_import = await conn.query(
                `CREATE TABLE IF NOT EXISTS import_account_list (
                    ${formatKeysData[0]} DATETIME,
                    ${formatKeysData[1]} VARCHAR(15),
                    ${formatKeysData[2]} VARCHAR(100),
                    ${formatKeysData[3]} VARCHAR(10),
                    ${formatKeysData[4]} VARCHAR(30),
                    ${formatKeysData[5]} VARCHAR(10),
                    ${formatKeysData[6]} VARCHAR(10),
                    ${formatKeysData[7]} VARCHAR(15),
                    ${formatKeysData[8]} VARCHAR(10),
                    ${formatKeysData[9]} DATETIME,
                    ${formatKeysData[10]} DATETIME,
                    ${formatKeysData[11]} VARCHAR(15),
                    ${formatKeysData[12]} VARCHAR(15),
                    ${formatKeysData[13]} DATETIME,
                    ${formatKeysData[14]} DATETIME,
                    ${formatKeysData[15]} VARCHAR(50),
                    ${formatKeysData[16]} VARCHAR(50),
                    ${formatKeysData[17]} VARCHAR(50),
                    ${formatKeysData[18]} VARCHAR(15),
                    ${formatKeysData[19]} DATETIME,
                    ${formatKeysData[20]} VARCHAR(100),
                    ${formatKeysData[21]} VARCHAR(100),
                    ${formatKeysData[22]} INT,
                    ${formatKeysData[23]} INT,
                    ${formatKeysData[24]} DATETIME,
                    ${formatKeysData[25]} DATETIME,
                    ${formatKeysData[26]} VARCHAR(10),
                    ${formatKeysData[27]} VARCHAR(10),
                    CONSTRAINT fk_import_account
                    FOREIGN KEY (${formatKeysData[1]}) REFERENCES account_list(${formatKeysData[1]})
                    ON DELETE SET NULL 
                    ON UPDATE CASCADE
                );`
            );
            console.log('Create Table(import_account_list) Result =>', createTableResult_import);


            // Retrieve data from the database
            const dbResults = await conn.query('SELECT * FROM account_list');
            const existingData = dbResults.map((row) => [
                row.created_time,
                row.basic_id,
                row.display_name,
                row.service_status
            ]
            );
            console.log('existingData:', existingData);
            console.log('existingData length:', existingData.length);

            // Update or insert data
            for (const nodeData of dataFromNodeJS) {
                const matchingRow = existingData.find((row) => row[1] === nodeData[1]);
                if (matchingRow) {
                    // Update existing data
                    await conn.query(
                        `UPDATE account_list SET 
                            ${formatKeysData[0]} = ?, 
                            ${formatKeysData[1]} = ?,
                            ${formatKeysData[2]} = ?,
                            ${formatKeysData[3]} = ?,
                            ${formatKeysData[4]} = ?,
                            ${formatKeysData[5]} = ?,
                            ${formatKeysData[6]} = ?,
                            ${formatKeysData[7]} = ?,
                            ${formatKeysData[8]} = ?,
                            ${formatKeysData[9]} = ?,
                            ${formatKeysData[10]} = ?,
                            ${formatKeysData[11]} = ?,
                            ${formatKeysData[12]} = ?,
                            ${formatKeysData[13]} = ?,
                            ${formatKeysData[14]} = ?,
                            ${formatKeysData[15]} = ?,
                            ${formatKeysData[16]} = ?,
                            ${formatKeysData[17]} = ?,
                            ${formatKeysData[18]} = ?,
                            ${formatKeysData[19]} = ?,
                            ${formatKeysData[20]} = ?,
                            ${formatKeysData[21]} = ?,
                            ${formatKeysData[22]} = ?,
                            ${formatKeysData[23]} = ?,
                            ${formatKeysData[24]} = ?,
                            ${formatKeysData[25]} = ?,
                            ${formatKeysData[26]} = ?,
                            ${formatKeysData[27]} = ?
                            WHERE basic_id = ?`,
                        [nodeData[0], nodeData[1], nodeData[2], nodeData[3], nodeData[4], nodeData[5],
                        nodeData[6], nodeData[7], nodeData[8], nodeData[9], nodeData[10], nodeData[11],
                        nodeData[12], nodeData[13], nodeData[14], nodeData[15], nodeData[16], nodeData[17],
                        nodeData[18], nodeData[19], nodeData[20], nodeData[21], nodeData[22], nodeData[23],
                        nodeData[24], nodeData[25], nodeData[26], nodeData[27],
                        matchingRow[1]]
                    );
                    console.log('Update one --> ', matchingRow[1]);

                } else {
                    // Insert new data
                    await conn.query(`INSERT INTO account_list
                        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, nodeData);

                    console.log('Insert new one --> ', nodeData[1]);
                }
            }


            const insertResult = await db.bulkInsertWithParams(
                `INSERT INTO import_account_list
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, dataFromNodeJS
            );
            console.log('Insert all --> import_account_list Result =>', insertResult);


            // Update data in the database that doesn't match the data from Node.js to 'unactive'
            for (const row of existingData) {
                console.log('workerrrr !!!');
                const matchingNodeData = dataFromNodeJS.find((nodeData) => nodeData[1] === row[1]);

                if (!matchingNodeData) {
                    await conn.query('UPDATE account_list SET service_status = ? WHERE basic_id = ?', ['Unactive', row[1]]);
                    console.log('update Unactive --> ', row[1]);
                    // % เก็บประวัติด้วย
                    // % transaction ทั้งหมด
                    // % ถ้าข้อมูลใหม่ basic id ซ้ำจะเกิด error *sol.1 query ตารางประวัติตัวล่าสุด sol.2 ควบคุมให้ rollback เมื่อ error
                }
            }

            // Commit Changes
            await conn.commit();
            return 'process success /^_^/';
        } catch (err) {
            if (conn) {
                await conn.rollback();
            }
            console.error('Error: ', err);
            return err;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },


}

module.exports = { ...methods }