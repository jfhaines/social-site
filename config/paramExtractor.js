module.exports = function(req, res, next) {
    if (!req.parameters) {
        req.parameters = {};
    }
    for (let paramKey in req.params) {
        req.parameters[paramKey] = req.params[paramKey]
    };
    next();
};