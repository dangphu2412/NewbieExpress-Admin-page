const { check, validationResult } = require('express-validator');

const checkRegister = [
    check('name')
      .trim()
      .isLength({ min : 1 })
      .withMessage('Your name is empty'),
    check('username')
      .trim().isLength({ min : 3 }).withMessage('Username must be at least 3 characters long'),
    check('email')
      .not().isEmpty(),
    check('password')
      .trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
      .matches(/\d/).withMessage('Must Contain A Number'),
    check('confirmPassword')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw Error('Password not match');
      }
      return true;
    })
];

const checkLogin = [
    check('username').not().isEmpty().trim().withMessage('Type down your username without empty'),
    check('password').trim().isLength({ min: 5 }).withMessage('Your password must be at least 5 chars'),
];

const checkProduct = [
    check('pr_name').trim().isLength({ min: 1 }).withMessage('Product is empty !!!'),
    check('price').trim().isLength({ min: 1 }).withMessage('Hey type down your price '),
    check('description').trim().isLength({ min: 1 }).withMessage('Don t forget to describe your product')
];

const checkPost = [
    check('title').trim().isLength({ min:1 }).withMessage('Title is empty'),
    check('content').trim().isLength({ min: 10}).withMessage('Your post can not less than 10 character ')
]
module.exports = { checkRegister, checkLogin, checkProduct, checkPost };