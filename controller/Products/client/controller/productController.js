const knex = require('../../../../database/connection');

const viewProduct = async (req, res) => {
    const { user } = req.session; 
    const products = await knex('products').select('*');
    const images = await knex('images').select('*');
    const types = await knex('product_types').select('*');
    const { updated } = res.locals;
    return res.render('app/client/index', {
        user, products, images, types, updated, title: 'hello'
    });
};

module.exports = { viewProduct };