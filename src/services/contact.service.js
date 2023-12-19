const db = require('./database.service')
const poolConnection = require('../configs/database').mariaDBCreatePool();
const utils = require('../utils/format-column-name.util');

const methods = {

    async findAll() {
        const result = await db.query('SELECT * FROM contact_list');
        console.log(`All Contact: ${result}`);
        return result;
    },

    async findByBasicId(basicId) {
        const result = await db.queryWithParams('SELECT * FROM contact_list WHERE basic_id = ?',[basicId]);
        console.log(`Query rows: ${result}`);
        return result;
    },

    async insertMany(req) {
        const data = req.body;
        //console.log(data);

        const keys = Object.keys(data[0]);
        //console.log(keys);

        const formatKeysData = keys.map((item) => {
            const itemlowerCase = item.toLocaleLowerCase();
            const withoutUnderscore = itemlowerCase.replace(/ /g, "_");
            const withoutParentheses = withoutUnderscore.replace(/\(|\)|\//g, "");
            return withoutParentheses;
        });
        //console.log(formatKeysData);


        const transformedValueData = data.map((obj) => {
            const values = Object.values(obj);
            return values;
        });
        //console.log(transformedValueData);


        const createTableResult = await db.query(
            `CREATE TABLE IF NOT EXISTS import_contact_lists (
                id INT NOT NULL AUTO_INCREMENT,
                ${formatKeysData[0]} VARCHAR(30),
                ${formatKeysData[1]} VARCHAR(50),
                ${formatKeysData[2]} VARCHAR(12),
                ${formatKeysData[3]} VARCHAR(50),
                ${formatKeysData[4]} VARCHAR(50),
                ${formatKeysData[5]} VARCHAR(50),
                ${formatKeysData[6]} VARCHAR(50),
                create_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id,${formatKeysData[0]})
            );`
        );
        console.log('Create Table Result =>', createTableResult);

        const insertResult = await db.bulkInsertWithParams(
            `INSERT INTO import_contact_lists (
                ${formatKeysData[0]},
                ${formatKeysData[1]},
                ${formatKeysData[2]},
                ${formatKeysData[3]},
                ${formatKeysData[4]},
                ${formatKeysData[5]},
                ${formatKeysData[6]})
                VALUES (?,?,?,?,?,?,?)`, transformedValueData
        );
        console.log('Insert data Result =>', insertResult);
    },

    async importContact(req) {
        const data = req.body;
        console.log(req.body);
        const keys = Object.keys(data[0]);
        const formatKeysData = utils.formatColumnName(keys);
        console.log('FormatColumnName =>', formatKeysData);

        const transformedValueData = data.map((obj) => {
            const values = Object.values(obj);
            return values;
        });
        console.log('Transformed value Result =>', transformedValueData);

        const processResult = await specialMethod.processImportContact(transformedValueData, formatKeysData);
        console.log('processResult =>', processResult);
        return processResult;
    }

}

const specialMethod = {

    async processImportContact(dataFromNodeJS, formatKeysData) {
        let conn;
        try {
            conn = await poolConnection.getConnection();

            // Start Transaction
            await conn.beginTransaction();

            const createTableResult_main = await conn.query(
                `CREATE TABLE IF NOT EXISTS contact_list (
                    ${formatKeysData[0]} VARCHAR(15) NOT NULL,
                    ${formatKeysData[1]} VARCHAR(50),
                    ${formatKeysData[2]} VARCHAR(12),
                    ${formatKeysData[3]} VARCHAR(50),
                    ${formatKeysData[4]} VARCHAR(50),
                    ${formatKeysData[5]} VARCHAR(50),
                    ${formatKeysData[6]} VARCHAR(50),
                    PRIMARY KEY (${formatKeysData[0]}),
                    CONSTRAINT fk_contact_account
                    FOREIGN KEY (${formatKeysData[0]}) REFERENCES account_list(${formatKeysData[0]})
                    ON DELETE NO ACTION 
                    ON UPDATE CASCADE
                );`
            );
            console.log('Create Table(contact_list) Result =>', createTableResult_main);

            const createTableResult_import = await conn.query(
                `CREATE TABLE IF NOT EXISTS import_contact_list (
                    ${formatKeysData[0]} VARCHAR(15),
                    ${formatKeysData[1]} VARCHAR(50),
                    ${formatKeysData[2]} VARCHAR(12),
                    ${formatKeysData[3]} VARCHAR(50),
                    ${formatKeysData[4]} VARCHAR(50),
                    ${formatKeysData[5]} VARCHAR(50),
                    ${formatKeysData[6]} VARCHAR(50),
                    CONSTRAINT fk_import_contact
                    FOREIGN KEY (${formatKeysData[0]}) REFERENCES contact_list(${formatKeysData[0]})
                    ON DELETE NO ACTION 
                    ON UPDATE CASCADE
                );`
            );
            console.log('Create Table(import_contact_list) Result =>', createTableResult_import);

            // Retrieve data from the database
            const dbResults = await conn.query('SELECT * FROM contact_list');
            const existingData = dbResults.map((row) => [
                row.basic_id,
                row.display_name,
                row.corporate_id
            ]
            );
            console.log('existingData:', existingData);
            console.log('existingData length:', existingData.length);

            for (const nodeData of dataFromNodeJS) {
                const matchingRow = existingData.find((row) => row[0] === nodeData[0]);
                if (matchingRow) {
                    // Update existing data
                    await conn.query(
                        `UPDATE contact_list SET
                        ${formatKeysData[0]} = ?,   
                        ${formatKeysData[1]} = ?,   
                        ${formatKeysData[2]} = ?,   
                        ${formatKeysData[3]} = ?,   
                        ${formatKeysData[4]} = ?,   
                        ${formatKeysData[5]} = ?,   
                        ${formatKeysData[6]} = ?
                        WHERE basic_id = ?`,
                        [nodeData[0], nodeData[1], nodeData[2], nodeData[3], nodeData[4], nodeData[5], nodeData[6],matchingRow[0]]
                    );
                    console.log('Update one --> ', matchingRow[0]);
                } else {
                    // Insert new data
                    await conn.query(`INSERT INTO contact_list
                        VALUES(?,?,?,?,?,?,?)`, nodeData);

                    console.log('Insert new one --> ', nodeData[0]);
                }
            }

            const insertResult = await db.bulkInsertWithParams(
                `INSERT INTO import_contact_list
                    VALUES(?,?,?,?,?,?,?)`, dataFromNodeJS
            );
            console.log('Insert all --> import_contact_list Result =>', insertResult);

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
    }
}

module.exports = { ...methods }