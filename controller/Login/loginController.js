const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../database/connection');

const checkinAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {     
      req.flash('errorInput', errors.array());        
      return res.redirect('/admin/login');
    }

    const data = await knex('users').where({ username : req.body.username }).first();
    if (data && bcrypt.compareSync(req.body.password, data.password)) 
      {   
        req.session.user = data;
        return res.redirect('/admin');
      }
    return res.redirect('/admin/login');
}

module.exports = { checkinAccount };