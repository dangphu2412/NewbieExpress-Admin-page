const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../database/connection');

const createAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {   
      req.flash('errorInput', errors.array());        
      return res.redirect('/admin/register');
    }
  
    const data = req.body;
    const user = await knex('users').where('username', data.username).first();
  
    if (user) {
      return res.redirect('/admin/register');
    }
    delete data.confirmPassword;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;
    await knex('users').insert(data);
    return res.redirect('/admin/login');
  };

module.exports = { createAccount };