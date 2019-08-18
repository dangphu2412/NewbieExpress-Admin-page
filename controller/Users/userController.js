const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../database/connection');

const userSearching = async (req, res) => {
    const { q } = req.query;
    const query = knex('users').select('*');
    if (q) {
      query.where('name', 'like', `%${q}%`).orWhere('email', 'like', `%${q}%`).orWhere('username', 'like', `%${q}%`);
    }
    const users = await query;
    return res.render('app/admin/users/manage', { users });
  };


const userCreate = async (req, res) => {
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

const userUpdate = async (req, res) => {
    const data = req.body;
    await knex('users').where({ username : data.username }).first().update({
        name : data.name,
        email : data.email,
    });   
    return res.redirect('/admin/users');
  }

const userDelete = async (req, res) => {
    const data = req.params.username;
    const session = req.session.user;
    if (session.username === data) {
      return res.redirect('/admin');
    }
    await knex('users').where('username', data).del(); 
    return res.redirect('/admin/users');
  }  
module.exports = { userSearching, userCreate, userUpdate, userDelete };