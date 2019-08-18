const express = require('express');
const multer  = require('multer');
const path    = require('path');
const knex    = require('../database/connection');

const router         = express.Router();
const authMiddleware = require('../middleware/authentication');
const validator      = require('../validation/validator');

const login       = require('../controller/Login/loginController');
const register    = require('../controller/Register/registerController');
const user        = require('../controller/Users/userController');
const productType = require('../controller/ProductTypes/productTypesController');
const product     = require('../controller/Products/productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
})
const upload = multer({ storage });

// Admin router
/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/admin/login');
});

router.get('/admin', authMiddleware.verifyAuth, async (req, res) => {
  const { user } = req.session; 
  const products = await knex('products').select('*');
  const images = await knex('images').select('*');
  const types = await knex('product_types').select('*');
  const { updated } = res.locals;
  return res.render('app/admin/index', {
     user, products, images, types, updated
  });
});

router.route('/admin/login')
        .get(authMiddleware.verifyNotAuth, (req, res) => {
  return res.render('app/admin/login');
})
        .post(validator.checkLogin, login.checkinAccount);

router.route('/admin/register')
        .get(authMiddleware.verifyNotAuth, (req, res) => {
  res.render('app/admin/register');
})
        .post(validator.checkRegister, register.createAccount);

router.get('/admin/general', (req, res) => {
  res.render('app/admin/general');
});

router.get('/admin/simple', (req, res) => {
  res.render('app/admin/simple');
});

router.get('/admin/logout', (req, res) => {
  delete req.session.user;
  return res.redirect('/admin/login');
});

// Manage with users
router.get('/admin/users', user.userSearching);

router.post('/admin/users/create', user.userCreate);

router.put('/admin/users/edit/:username', user.userUpdate);

router.delete('/admin/users/delete/:username', user.userDelete);

// Manage with products

router.get('/admin/products', authMiddleware.verifyAuth, productType.displayProductType);

router.post('/admin/products/create_prtype', productType.createProductType);

router.post('/admin/products/create_product', upload.array('avatar', 10), product.createProduct);

router.delete('/admin/products/delete/:slug', product.deleteProduct);

router.post('/admin/products/update/:slug', upload.array('avatar', 10), product.updateProduct);

module.exports = router;
