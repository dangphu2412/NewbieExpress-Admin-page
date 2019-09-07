const express = require('express');
const passport = require('passport');
const authMiddleware = require('../middleware/authentication');

const login       = require('../controller/Login/client/controller/loginController');
const register    = require('../controller/Register/client/controller/registerController');
const product     = require('../controller/Products/client/controller/productController');
const post        = require('../controller/Posts/client/controller/postController');
const validator   = require('../validation/validator');

const router = express.Router();

// Client router

router.route('/login')
        .get(authMiddleware.verifyNotAuth, (req, res) => {
          return res.render('app/admin/login');
        })
        .post(validator.checkLogin, login.checkinAccount);

router.route('/register')
        .get(authMiddleware.verifyNotAuth, (req, res) => {
          res.render('app/admin/register');
        })
        .post(validator.checkRegister, register.createAccount);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => { 
    let data = {
      id: req.session.passport.user
    };
    req.session.user = data;
    return res.redirect('/admin');
  });

router.get('/product', authMiddleware.verifyAuth, product.viewProduct);

router.get('/', authMiddleware.verifyAuth, post.viewCategorises);

router.get('/:slug/:slug', authMiddleware.verifyAuth, post.viewPost);

module.exports = router;
