let express = require('express');
let router = express.Router();

let verify = require('../config/verify');
let paramExtractor = require('../config/paramExtractor');
let friendController = require('../controllers/friendController');


// Authenticate
router.use(verify)


// CREATE friend
router.post('/', friendController.create);

// READ friend
router.get('/:friendid', paramExtractor, friendController.read);

// READ all friends
router.get('/', friendController.readAll);

// DELETE friend
router.delete('/:friendid', paramExtractor, friendController.delete);


module.exports = router;