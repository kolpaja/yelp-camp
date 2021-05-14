module.exports = funx => {
    return (req, res, next) => {
        funx(req, res, next).catch(next);
    }
}