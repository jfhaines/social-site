let express = require('express');
let router = express.Router();

let verify = require('../config/verify');
let paramExtractor = require('../config/paramExtractor');
let postController = require('../controllers/postController');


// Authenticate
router.use(verify)


// CREATE post
router.post('/', postController.create);

// READ post
router.get('/:postid', paramExtractor, postController.read);

// READ all posts
router.get('/', postController.readAll);

// UPDATE post
router.put('/:postid', paramExtractor, postController.update);

// DELETE post
router.delete('/:postid', paramExtractor, postController.delete);


module.exports = router;