const { validationResult } = require('express-validator');
const mySlug = require('speakingurl');
const knex = require('../../database/connection');
const { s3Upload } = require('../../services/file-upload');

const searchProduct = async (req, res) => {
   const query = req.query.queryProduct;
   const search = await knex('products').select('*');
   if (query) {
     search.where()
   }
}

const createProduct = async (req, res) => {
    const data = req.body;
    const product = await knex('products').where('pr_name', data.pr_name).first();
    const type = await knex('product_types').where('type', data.select_type).first();
    const { user } = req.session;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {   
      req.flash('errorInput', errors.array());       
      return res.redirect('/admin/products');
    }
    if (product) {
      return res.redirect('/admin/products');
    }
    data.slug = mySlug(data.pr_name);
    data.product_type_id = type.id;
    data.author_id = user.id;
    delete data.select_type;
    await knex('products').insert(data);
    const productId = await knex('products').where('pr_name', data.pr_name).first();
    const { files } = req;
    files.forEach(async (file) => {
      file.url = await s3Upload(file);   
      await knex('images').insert({
            url: file.url,
            product_id: productId.id,
          });
    });  
    return res.redirect('/admin');
};

const deleteProduct = async (req, res) => {
    const data = req.params.slug;
    const productId = await knex('products').where('slug', data).first();
    await knex('images').where('product_id', productId.id).del();
    await knex('products').where('slug', data).del();
    return res.redirect('/admin');
};

const updateProduct = async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {   
      req.flash('errorInput', errors.array());        
      return res.redirect('/admin');
    }
    const productId = await knex('products').where('slug', req.params.slug).first();
    const { files } = req;
    files.forEach(async (file) => {
      file.url = await s3Upload(file);   
      await knex('images').insert({
            url: file.url,
            product_id: productId.id,
          });
    });  
    await knex('products')
      .where('slug', req.params.slug)
      .first()
      .update({
        pr_name: data.pr_name,
        slug: mySlug(data.pr_name),
        price: data.price,
        description: data.description,
    });
    req.flash('updated', 'Update complete');
    return res.redirect('/admin');
  };

module.exports = { searchProduct, createProduct, deleteProduct, updateProduct };