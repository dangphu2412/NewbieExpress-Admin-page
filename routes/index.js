const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const mySlug = require('speakingurl');
const multer = require('multer');
const knex = require('../database/connection');

const router = express.Router();
const authMiddleware = require('../middleware/authentication');
const validator = require('../validation/validator');

const storage = multer.diskStorage({
  destination : function (req, file, cb) {
     cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });

// Admin router
/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/admin/login');
});

router.get('/admin', authMiddleware.verifyAuth, async (req, res) => {
  const { name } = req.session.user; 
  const product = await knex('products').select('*');
  const images = await knex('images').select('*');
  const types = await knex('product_types').select('*');
  return res.render('app/admin/index', { username: name, products: product, images: images, types: types});
});

router.get('/admin/login', authMiddleware.verifyNotAuth, (req, res) => {
  return res.render('app/admin/login');
});

router.get('/admin/register', authMiddleware.verifyNotAuth, (req, res) => {
  res.render('app/admin/register');
});

router.post('/admin/register', validator.checkRegister , async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {   
    req.flash('errorInput', errors.array());        
    return res.redirect('/admin/register');
  }

  const data = req.body;
  const user = await knex('users').where('username', data.username).first();

  if (user) {
    return res.redirect('/admin/register');
  }
  delete data.confirmPassword;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(data.password, salt);
  data.password = hash;
  await knex('users').insert(data);
  return res.redirect('/admin/login');
});

router.post('/admin/login', validator.checkLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {     
    req.flash('errorInput', errors.array());        
    return res.redirect('/admin/login');
  }

  const data = await knex('users').where({ username : req.body.username }).first();
  if (data && bcrypt.compareSync(req.body.password, data.password)) 
    {   
      req.session.user = data;
      return res.redirect('/admin');
    }
  return res.redirect('/admin/login');

});

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

// Mange with users
router.get('/admin/users', async (req, res) => {
  const { q } = req.query;
  let query = knex('users').select('*');
  if (q) {
    query.where('name', 'like', `%${q}%`).orWhere('email','like',`%${q}%`).orWhere('username','like',`%${q}%`);
  }
  const users = await query;
  return res.render('app/admin/users/manage', { users });
});

router.post('/admin/users/create', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errorInput', errors.array());        
    return res.redirect('/admin');
  }

  const data = req.body;
  const user = await knex('users').where('username', data.username).first();

  if (user) {
    return res.redirect('/admin');
  }
  delete data.confirmPassword;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(data.password, salt);
  data.password = hash;

  await knex('users').insert(data);
  return res.redirect('/admin/users');
});

router.put('/admin/users/edit/:username', async (req, res) => {
  const data = req.body;
  await knex('users').where({ username : data.username }).first().update({
      name : data.name,
      email : data.email
  });   
  return res.redirect('/admin/users');
});

router.delete('/admin/users/delete/:username', async (req, res) => {
  const data = req.params.username;
  const session = req.session.user;
  if (session.username === data) {
    return res.redirect('/admin');
  }
  await knex('users').where('username', data).del(); 
  return res.redirect('/admin/users');
});

// Manage with products

router.get('/admin/products', authMiddleware.verifyAuth, async (req, res) => {
  const types = await knex('product_types').select('type');
  return res.render('app/admin/users/create', { types });
});

router.post('/admin/products/create_prtype', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {   
    req.flash('errorInput', errors.array());        
    return res.redirect('/admin/product');
  };
  const data = req.body;
  const type = await knex('product_types').where('type', data.type).first();
  if (type) {
    return res.redirect('/admin/products');
  }
  data.slug = mySlug(data.type);
  await knex('product_types').insert(data);
  return res.redirect('/admin/products');
});

router.post('/admin/product/create_product', upload.array('avatar', 10), validator.checkProduct, async (req, res) => {
  const data = req.body;
  const product = await knex('products').where('pr_name', data.pr_name).first();
  const type = await knex('product_types').select('id').where('type', data.select_type).first();
  const user = await knex('users').select('id').where('name', req.session.user.name).first();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {   
    req.flash('errorInput', errors.array());        
    return res.redirect('/admin/products');
  }
  if (product) {
    return res.redirect('/admin/products');
  }
  await knex('products').insert({
      pr_name : data.pr_name,
      slug : mySlug(data.pr_name),
      price : data.price,
      description : data.description,
      product_type_id : type.id,
      author_id : user.id
  });
  const product_id = await knex('products').select('id').where('pr_name', data.pr_name).first();
  const files = req.files;
  files.forEach(async (file) => {
    await knex('images').insert({
          url : file.originalname,
          product_id : product_id.id
        })
    });
  
  return res.redirect('/admin');
});

router.get('/admin/product/create', (req, res) => {
  return res.render('app/admin/users/product');
});

router.delete('/admin/products/delete/:slug', async (req, res) => {
  const data = req.params.slug;
  const product_id = await knex('products').where('slug', data).first();
  await knex('images').where('product_id', product_id.id).del();
  await knex('products').where('slug', data).del();
  return res.redirect('/admin');
});

router.post('/admin/products/update/:slug',upload.array('avatar', 10) ,validator.checkProduct ,async (req, res) => {
  const data = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {   
    req.flash('errorInput', errors.array());        
    return res.redirect('/admin/products');
  }
  await knex('products').where('pr_name', data.pr_name).first().update({
      pr_name : data.pr_name,
      slug : mySlug(data.pr_name),
      price : data.price,
      description : data.description,
  });
  const product_id = await knex('products').where('pr_name', data.pr_name).first();
  const files = req.files;
  files.forEach(async (file) => {
    await knex('images').insert({
          url : file.originalname,
          product_id : product_id.id
        })
    });
  console.log(data);
  return res.redirect('/admin');
});

module.exports = router;
