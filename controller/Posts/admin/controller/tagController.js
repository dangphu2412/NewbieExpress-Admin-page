const { validationResult } = require('express-validator');
const mySlug = require('speakingurl');
const knex = require('../../../../database/connection');

const overViewTag = async (req, res) => {
    const user = await knex('users').where('id', req.session.user.id).first();
    const types = await knex('product_types').select('*');
    const tags = await knex('tags').select('*');
    return res.render('app/admin/tags/view', { user, types, tags });
};

const createTag = async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errorInput', errors.array());
        return res.redirect('/admin/tags');
    }
    const tag = await knex('tags').where('tag_name', data.tag_name).first();
    if (tag) {
        req.flash('duplicated', 'It has already been existed !');
        return res.redirect('/admin/tags');
    }
    data.slug = mySlug(data.tag_name);
    await knex('tags').insert(data);
    return res.redirect('/admin/tags'); 
};

const updateTag = async (req, res) => {
    const data = req.body;
    const { slug } = req.params;
    data.slug = mySlug(data.tag_name);    
    await knex('tags').where('slug', slug).update(data);
    return res.redirect('/admin/tags');
};

const deleteTag = async (req, res) => {
   const { slug } = req.params;
   await knex('tags').where('slug', slug).first().del();
   return res.redirect('/admin/tags');
};

module.exports = { overViewTag, createTag, updateTag, deleteTag };