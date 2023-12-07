const router = require('express').Router()

// http://localhost:3001/api/v1/

router.use('/users', require('./user'))


module.exports = router