const knex = require('../../../../database/connection');

const viewCategorises = async (req, res) => {
    const categories = await knex('category').select('category_name', 'slug', 'id');
    const posts = await knex('posts').select('title', 'slug', 'content', 'category_id');
    return res.render('app/client/category', { categories, posts, title: 'hello' });
};

const viewPost = async (req, res) => {
    const { slug } = req.params;
    const { user } = req.session;
    const post = await knex('posts').where('slug', slug).first();
    if (post) {
        return res.render('app/client/post', { post, user, title: 'hello' });
    }
    return res.redirect('/categorises');
};

module.exports = { viewCategorises, viewPost };