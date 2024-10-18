// 导入express框架
const express = require('express');

// 使用express框架的路由
const router = express.Router();

// 导入login路由处理模块
const userinfoHandler = require('../router_handle/user_info');

// 导入joi
const expressJoi = require("@escook/express-joi");