const Service = require('../services/account.service');


const methods = {

    async onGetAll(req,res) {
        try {
            const result = await Service.findAll();
            res.send(result);
        } catch (err) {
            console.error("Error get all users controller: ", err);
            res.send(err);
        }
    },


    async onImportAccount(req, res){
        try {
            const result = await Service.importAccount(req);
            res.send(result);
            
        } catch (err) {
            console.error(err);
            res.send(err);
        }
    }
}

module.exports = { ...methods }