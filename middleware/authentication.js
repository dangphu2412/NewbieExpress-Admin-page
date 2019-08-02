const verifyAuth = (req, res, next) => {
     if (req.session.user) {
         return next();
     }
     return res.redirect('/admin/login');
}

const verifyNotAuth = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    return res.redirect('/admin');
}
const checkType = (req, res, next) => {
    
}

module.exports = { verifyAuth, verifyNotAuth };