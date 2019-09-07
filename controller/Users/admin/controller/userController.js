const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../../../database/connection');

const searchUser = async (req, res) => {
    const { q } = req.query;
    const query = knex('users').select('*');
    const types = await knex('product_types').select('*');
    if (q) {
      query.where('name', 'like', `%${q}%`).orWhere('email', 'like', `%${q}%`).orWhere('username', 'like', `%${q}%`);
    }
    const users = await query;
    const user = await knex('users').where('id', req.session.user.id).first();
    return res.render('app/admin/users/manage', { users, user, types });
  };


const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errorInput', errors.array());        
      return res.redirect('/admin');
    }
    const data = req.body;
    const user = await knex('users').where('username', data.username).first(); 
    if (user) {
      return res.redirect('/admin');
    }
    delete data.confirmPassword;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;
  
    await knex('users').insert(data);
    return res.redirect('/admin/users');
  }

const updateUser = async (req, res) => {
    const data = req.body;
    await knex('users').where('username', data.username).first().update({
        name: data.name,
        email: data.email,
    });   
    return res.redirect('/admin/users');
  }

const deleteUser = async (req, res) => {
    const data = req.params.id;
    const session = req.session.user;
    console.log(`session of user ${session.user} and data id${data}`);
    if (session.id === data) {
       console.log('success');  
        return res.redirect('/admin');
    }
    await knex('users').where('id', data).del(); 
    return res.redirect('/admin/users');
  }  
module.exports = {
  searchUser, createUser, updateUser, deleteUser
};
