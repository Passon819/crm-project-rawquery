const router = require('express').Router();
const controller = require('../../controllers/contact.controller')

router.get('/all', controller.onGetAll)
router.get('/:id', controller.onGetbyBasicID)
router.post('/inserts', controller.onImportContact)

module.exports = router