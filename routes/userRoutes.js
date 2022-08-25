let express = require('express');
let router = express.Router();

let verify = require('../config/verify');
let paramExtractor = require('../config/paramExtractor');
let userController = require('../controllers/userController');



// Login user
router.post('/login', userController.login);

// CREATE user
router.post('/', userController.create);


// Authenticate
router.use(verify)


// READ single user
router.get('/:userid', paramExtractor, userController.read);

// READ all users
router.get('/', userController.readAll);

// UPDATE user
router.put('/:userid', paramExtractor, userController.update);

// DELETE user
router.delete('/:userid', paramExtractor, userController.delete);

// Logout user
router.post('/logout', userController.logout)

module.exports = router;