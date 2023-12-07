const router = require('express').Router()
const controllers = require('../../controllers/user.controller')

// http://localhost:3001/api/v1/users

router.get('/', controllers.onGetTutorials)
router.get('/all', controllers.onGetAll)
router.get('/:name', controllers.onGetwithName)

// router.get('/:id',(req, res)=>{    
// })

module.exports = router