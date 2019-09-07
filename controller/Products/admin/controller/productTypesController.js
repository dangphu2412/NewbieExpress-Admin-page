const { validationResult } = require('express-validator');
const mySlug = require('speakingurl');
const knex = require('../../../../database/connection');

const displayProductView = async (req, res) => {
    const types = await knex('product_types').select('type');
    return res.render('app/admin/products/create', { types });
};

const createProductType = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {   
      req.flash('errorInput', errors.array());        
      return res.redirect('/product');
    };
    const data = req.body;
    const type = await knex('product_types').where('type', data.type).first();
    if (type) {
      return res.redirect('/admin/products');
    }
    data.slug = mySlug(data.type);
    await knex('product_types').insert(data);
    return res.redirect('/admin/products');
};

const viewProductType = async (req, res) => {
  const products = await knex('products').select('*');
  const images = await knex('images').select('*');
  const types = await knex('product_types').select('id', 'slug');
  const { updated } = res.locals;
  const { slug } = req.params;
  const prType = await knex('product_types').where('slug', slug).first(); 
  return res.render('app/admin/products/viewProduct', { types, products, images, updated, prType });
};

module.exports = { displayProductView, createProductType, viewProductType };