const joi = require('joi');

const account = joi.string().alphanum().min(6).max(10).required();
const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required();

exports.login_limit = {
    body: {
        account: account,
        password: password,
    }
}