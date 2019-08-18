const { validationResult } = require('express-validator');
const mySlug = require('speakingurl');
const knex = require('../../database/connection');

const displayProductType = async (req, res) => {
    const types = await knex('product_types').select('type');
    return res.render('app/admin/users/create', { types });
}

const createProductType = async (req, res) => {
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
}

module.exports = { displayProductType, createProductType };