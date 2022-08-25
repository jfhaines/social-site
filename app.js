// import npm packages
let express = require('express');


// import local modules
require('./config/mongoose');
require('./config/passport');

let userRoute = require('./routes/userRoutes');
let postRoute = require('./routes/postRoutes');
let commentRoute = require('./routes/commentRoutes');
let likeRoute = require('./routes/likeRoutes');
let friendRequestRoute = require('./routes/friendRequestRoutes');
let friendRoute = require('./routes/friendRoutes');
let jwtToken = require('./config/jwtToken');
let blacklist = require('./config/blacklist');
let paramExtractor = require('./config/paramExtractor');


// start application
let app = express();


// set-up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(jwtToken, blacklist);
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/post/:postid/comment', paramExtractor, commentRoute);
app.use('/post/:postid/like', paramExtractor, likeRoute);
app.use('/user/:userid/friendrequest', paramExtractor, friendRequestRoute);
app.use('/user/:userid/friend', paramExtractor, friendRoute);


// set-up error handling middleware
app.use((req, res, next) => {
    let error = new Error('Not found');
    error.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;
    res.json({ message: err.message, status: err.status });
});

// start listening
app.listen(3000);