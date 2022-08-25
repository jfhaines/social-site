let express = require('express');
let router = express.Router();

let verify = require('../config/verify');
let paramExtractor = require('../config/paramExtractor');
let likeController = require('../controllers/likeController');


// Authenticate
router.use(verify)


// CREATE like
router.post('/', likeController.create);

// READ all likes
router.get('/', likeController.readAll);

// DELETE like
router.delete('/:likeid', paramExtractor, likeController.delete);


module.exports = router;