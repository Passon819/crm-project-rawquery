const router = require('express').Router()

// http://localhost:3001/api/v1/

router.use('/users', require('./user'))
router.use('/account', require('./account'))
router.use('/contact', require('./contact'))


module.exports = router