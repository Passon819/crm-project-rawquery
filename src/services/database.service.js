const connection = require('../configs/database')

async function query(sql) {
    let conn = await connection.getConnection();
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
    let conn = await connection.getConnection();
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

module.exports = { query, queryWithParams }