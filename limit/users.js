const joi = require('joi');

const id = joi.required();
const account = joi.string().alphanum().min(6).max(10).required();
const name = joi.string().pattern(/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/).required();
const email = joi.string().pattern(/^[0-9A-Za-z_]+([-+.][0-9A-Za-z_]+)*@[0-9A-Za-z_]+([-.][0-9A-Za-z_]+)*\.[0-9A-Za-z_]+([-.][0-9A-Za-z_]+)*$/).required();
const old_pwd = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required();
const new_pwd = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required();

exports.password_limit = {
    body: {
        id: id,
        old_pwd: old_pwd,
        new_pwd: new_pwd,
    }
}

exports.name_limit = {
    body: {
        id: id,
        name: name,
    }
}

exports.email_limit = {
    body: {
        id: id,
        email: email,
    }
}

exports.update_pwd_limit = {
    body: {
        account: account,
        new_pwd: new_pwd,
    }
}