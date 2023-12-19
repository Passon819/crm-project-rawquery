const Service = require('../services/contact.service');

const methods = {

    async onGetAll(req,res) {
        try {
            const result = await Service.findAll();
            res.send(result);
        } catch (err) {
            console.error("Error get all contact controller: ", err);
            res.send(err);
        }
    },

    async onGetbyBasicID(req,res) {
        console.log(`param: ${req.params.id}`);
        try {
            const result = await Service.findByBasicId(req.params.id);
            res.send(result);
        } catch (err) {
            console.error("Error get contact by basic_id controller: ", err);
            res.send(err);
        }
    },

    async onImportContact(req, res){
        try {
            const result = await Service.importContact(req);
            res.send(result);
        } catch (err) {
            console.error(err);
            res.send(err);
        }
    },

}

module.exports =  { ...methods }