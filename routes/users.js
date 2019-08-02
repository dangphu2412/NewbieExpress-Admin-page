const express = require('express');

const router = express.Router();

// Client router
router.get('/', (req, res) => {
  return res.render('app/client/index', { title : 'yasuo' });
});

// Get about page
router.get('/about', (req, res) => {
  return res.render('app/client/about', { title : 'about' });
});

// GET contact page
router.get('/contact', (req, res) => {
  return res.render('app/client/contact', { title : 'contact' }); 
});

// GET post page
router.get('/post', (req, res) => {
  return res.render('app/client/post', {title : 'post' });
});

module.exports = router;
