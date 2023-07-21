/*
* It takes a function(func) and returns another function
* after executing func. If it catches any error it passes
* it to next.
*/
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}