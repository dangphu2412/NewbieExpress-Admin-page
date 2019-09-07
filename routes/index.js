const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const passport = require('passport');

const router         = express.Router();
const authMiddleware = require('../middleware/authentication');
const validator      = require('../validation/validator');

const login       = require('../controller/Login/client/controller/loginController');
const register    = require('../controller/Register/client/controller/registerController');
const users       = require('../controller/Users/admin/controller/userController');
const productType = require('../controller/Products/admin/controller/productTypesController');
const product     = require('../controller/Products/admin/controller/productController');
const category    = require('../controller/Posts/admin/controller/categoryController');
const post        = require('../controller/Posts/admin/controller/postController');
const tag         = require('../controller/Posts/admin/controller/tagController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
  }
})
const upload = multer({ storage });

// Admin router
/* GET home page. */
router.get('/', authMiddleware.verifyAuth, product.admin);

router.get('/general', (req, res) => {
  res.render('app/admin/general');
});

router.get('/simple', (req, res) => {
  res.render('app/admin/simple');
});

router.get('/logout', (req, res) => {
  delete req.session.user;
  delete req.session.passport;
  return res.redirect('/admin/login');
});

// Manage with users
router.get('/users', authMiddleware.verifyAuth, users.searchUser);

router.post('/users/create', users.createUser);

router.put('/users/edit/:username', users.updateUser);

router.delete('/users/delete/:id', users.deleteUser);

// Manage with products
router.get('/', authMiddleware.verifyAuth, product.searchProduct);

router.get('/products', authMiddleware.verifyAuth, productType.displayProductView);

router.get('/products/:slug', authMiddleware.verifyAuth, productType.viewProductType);

router.post('/products/create_prtype', productType.createProductType);

router.post('/products/create_product', upload.array('avatar', 10), validator.checkProduct, product.createProduct);

router.post('/products/update/:slug', upload.array('updateAvatar', 10), product.updateProduct);

router.delete('/products/delete/:slug', product.deleteProduct);

// Manage with category
router.get('/category', authMiddleware.verifyAuth, category.viewCategory);

router.post('/category/create', category.createCategory);

router.put('/category/update/:slug', category.updateCategory);

router.delete('/category/delete/:slug', category.deleteCategory);

// Manage with posts

router.get('/posts', authMiddleware.verifyAuth, post.overViewPost);

router.post('/posts/create', validator.checkPost, post.createPost);

router.post('/posts/image', upload.single('file'), post.uploadImagePost);

router.get('/posts/view', authMiddleware.verifyAuth, post.viewTitlePost);

router.get('/posts/view/:slug', authMiddleware.verifyAuth, post.viewPost);

router.get('/posts/update/:slug', authMiddleware.verifyAuth, post.viewUpdatePost);

router.put('/posts/update/:slug', post.updatePost);

// Manage with tags

router.get('/tags', authMiddleware.verifyAuth, tag.overViewTag);

router.post('/tags/create', tag.createTag);

router.put('/tags/update/:slug', tag.updateTag);

router.delete('/tags/delete/:slug', tag.deleteTag);


module.exports = router;
