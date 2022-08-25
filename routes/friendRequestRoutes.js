let express = require('express');
let router = express.Router();

let verify = require('../config/verify');
let paramExtractor = require('../config/paramExtractor');
let friendRequestController = require('../controllers/friendRequestController');

// Authenticate
router.use(verify)


// CREATE friend request
router.post('/', friendRequestController.create);

// READ friend request
router.get('/:friendrequestid', paramExtractor, friendRequestController.read);

// READ all friend requests
router.get('/', friendRequestController.readAll);

// DELETE friend
router.delete('/:friendrequestid', paramExtractor, friendRequestController.delete);


module.exports = router;