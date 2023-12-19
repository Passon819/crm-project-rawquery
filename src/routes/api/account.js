const router = require('express').Router()
const controller = require('../../controllers/account.controller')

router.get('/all', controller.onGetAll)
router.post('/inserts', controller.onImportAccount)

module.exports = router