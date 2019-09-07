const mySlug               = require('speakingurl');
const knex                 = require('../../../../database/connection');

const viewCategory = async (req, res) => {
    const user = await knex('users').where('id', req.session.user.id).first();
    const types = await knex('product_types').select('*');
    const categorises = await knex('category').select('*');
    return res.render('app/admin/post/category', { user, types, categorises });
};
const createCategory = async (req, res) => {
   const data = req.body;
   const category = await knex('category').where('category_name', data.category_name).first();
   if (category) {
       return res.redirect('/admin/posts');
   }
   data.slug = mySlug(data.category_name);
   await knex('category').insert(data);
   return res.redirect('/admin/posts');
};

const updateCategory = async (req, res) => {
  const data = req.body;
  const { slug } = req.params;
  data.slug = mySlug(data.category_name);
  await knex('category').where('slug', slug).update(data);
  return res.redirect('/admin/category');
};

const deleteCategory = async (req, res) => {
  const { slug } = req.params;
  await knex('category').where('slug', slug).delete();
  return res.redirect('/admin/category');
};
module.exports = { viewCategory, createCategory, updateCategory, deleteCategory };
