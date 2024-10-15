// 登录注册模块路由

// 导入express框架
const express = require('express');

// 使用express框架的路由
const router = express.Router();

// 导入login路由处理模块
const loginHandler = require('../router_handle/login');

// 导入joi
const expressJoi = require("@escook/express-joi");
const {
    login_limit
} = require("../limit/login.js");

router.post('/register', expressJoi(login_limit), loginHandler.register);
router.post('/login', expressJoi(login_limit), loginHandler.login);

// 向外暴露路由
module.exports = router;