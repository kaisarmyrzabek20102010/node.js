const express = require('express');
const {register, login,addtort, gettort, deltort,updatetort} = require('../controllers/authcontrollers');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addtort', addtort);
router.get('/gettort',gettort)
router.delete('/deltort',deltort)
router.put('/updatetort/:id',updatetort)

module.exports = router;