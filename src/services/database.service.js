const poolConnection = require('../configs/database').mariaDBCreatePool();
const createConnection = require('../configs/database').mariaDBCreateConnection();

// ------ Global database service ------

async function query(sql) {
    let conn = await poolConnection.getConnection();
    let result;
    try {
        result = await conn.query(sql);
        //console.log(result);
    } catch (err) {
        console.log(err);
    } finally {
        if (conn) conn.release();
    }
    return result;
}

async function queryWithParams(sql, params) {
    let conn = await poolConnection.getConnection();
    let result;
    try {
        result = await conn.query(sql, params);
        //console.log(result);
    } catch (err) {
        console.log(err);
    } finally {
        if (conn) conn.release();
    }
    return result;
}

// เหลือ end()
async function bulkInsertWithParams(sql, params) {
    let result;
    try {
        result = (await createConnection).batch(sql, params);
    } catch (err) {
        console.error("Error batch to the database: ", err);
    }
    return result;
}

module.exports = { query, queryWithParams, bulkInsertWithParams }