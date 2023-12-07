const db = require('./database.service')

const methods = {

    async findAll() {
        const result = await db.query('SELECT * FROM contact_list');
        console.log(`Query rows: ${result}`);
        return result;
    },

    async findbyName(name) {
        const result = await db.queryWithParams('SELECT * FROM contact_list WHERE Name = ?',[name]);
        console.log(`Query rows: ${result}`);
        return result;
    }
}

module.exports = { ...methods }