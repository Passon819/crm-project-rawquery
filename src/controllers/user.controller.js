const Service = require('../services/user.service')

const connection = require('../configs/database')


const methods = {

    async onGetTutorials(req, res){
        let conn = await connection.getConnection();
        try {
            let result = await conn.query('SELECT * FROM tutorials');
            console.log('result tutorials: '+ result); 
            res.send(result);

        } catch (err) {
            res.send(err)
        } finally {
            if (conn) return conn.release();
        }
    },
    // /all
    async onGetAll(req, res){
        try {
            const result = await Service.findAll()
            res.send(result);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    },

    async onGetwithName(req, res){
        console.log(`param: ${req.params.name}`);
        try {
            const result = await Service.findbyName(req.params.name)
            res.send(result);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }
}

module.exports = { ...methods }