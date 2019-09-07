const verifyAuth = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.redirect('/login');
}

const verifyNotAuth = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    return res.redirect('/admin');
}

module.exports = { verifyAuth, verifyNotAuth };