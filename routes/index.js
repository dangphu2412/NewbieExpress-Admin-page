const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/admin');
});

router.get('/admin', (req, res) => {
  res.render('app/admin/index');
});

router.get('/admin/login', (req, res) => {
  res.render('app/admin/login');
});

router.get('/admin/register', (req, res) => {
  res.render('app/admin/register');
});

router.get('/admin/general', (req, res) => {
  res.render('app/admin/general');
});

router.get('/admin/simple', (req, res) => {
  res.render('app/admin/simple');
});

module.exports = router;
