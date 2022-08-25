let express = require('express');
let router = express.Router();

let verify = require('../config/verify');
let paramExtractor = require('../config/paramExtractor');
let commentController = require('../controllers/commentController');


// Authenticate
router.use(verify)

// CREATE comment
router.post('/', commentController.create);

// READ comment
router.get('/:commentid', commentController.read);

// READ all comments
router.get('/', paramExtractor, commentController.readAll);

// UPDATE comment
router.put('/:commentid', paramExtractor, commentController.update);

// DELETE comment
router.delete('/:commentid', paramExtractor, commentController.delete);


module.exports = router;