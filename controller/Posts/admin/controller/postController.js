const { validationResult } = require('express-validator');
const mySlug               = require('speakingurl');
const knex                 = require('../../../../database/connection');
const { s3Upload }         = require('../../../../services/file-upload');

const overViewPost = async (req, res) => {
    const user = await knex('users').where('id', req.session.user.id).first();
    const products = await knex('products').select('*');
    const images = await knex('images').select('*');
    const types = await knex('product_types').select('*');
    const categorises = await knex('category').select('*');
    const tags = await knex('tags').select('tag_name');
    return res.render('app/admin/post/create', { user, products, images, types, categorises, tags });
};

const createPost = async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    const category = await knex('category').where('category_name', data.category).first();
    if (!errors.isEmpty()) {
        req.flash('errorInput', errors.array());             
        return res.redirect('/admin/posts');
    }
    const titleCheck = await knex('posts').where('title', data.title).first();
    if (titleCheck) {
        req.flash('duplicated', 'It has already been existed !');
        return res.redirect('/admin/posts');
    }
    data.slug = mySlug(data.title);
    data.author_id = req.session.user.id;
    data.category_id = category.id;
    delete data.category;
    await knex('posts').insert({
        title: data.title,
        slug: data.slug,
        content: data.content,
        category_id: data.category_id,
        author_id: data.author_id
    });
    const postId = await knex('posts').where('slug', data.slug).first();
    data.tag_names.forEach(async (tagName) => {
        const tagId = await knex('tags').where('tag_name', tagName).first();        
        await knex('post_tags').insert({
            post_id: postId.id,
            tag_id: tagId.id
        });
    });
    return res.redirect('/admin/posts/view');   
};

const uploadImagePost = async (req, res) => {
    const { file } = req;
    const data = await s3Upload(file);
    return res.json({ location: data });
};

const viewTitlePost = async (req, res) => {
    const titles = await knex('posts').select('title', 'slug');
    const user = await knex('users').where('id', req.session.user.id).first();
    const types = await knex('product_types').select('*');
    return res.render('app/admin/post/title', { titles, user, types });
};

const viewPost = async (req, res) => {
    const { slug } = req.params;
    const user = await knex('users').where('id', req.session.user.id).first();
    const types = await knex('product_types').select('*');
    const post = await knex('posts').where('slug', slug).first();  
    return res.render('app/admin/post/post', { user, types, post });
};

const viewUpdatePost = async (req, res) => {
    const { slug } = req.params;
    const user = await knex('users').where('id', req.session.user.id).first();
    const types = await knex('product_types').select('*');
    const post = await knex('posts').where('slug', slug).first();  
    return res.render('app/admin/post/update', { user, types, post });
};

const updatePost = async (req, res) => {
    const { slug } = req.params;
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errorInput', errors.array());
        return res.redirect('/admin/posts');
    }
    data.slug = mySlug(data.title);
    await knex('posts').where('slug', slug).update(data);
    return res.redirect('/admin/posts/view');
};

module.exports = {overViewPost, createPost, uploadImagePost, viewTitlePost, viewPost, viewUpdatePost, updatePost };