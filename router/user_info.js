// 导入express框架
const express = require('express');

// 使用express框架的路由
const router = express.Router();

// 导入userinfo路由处理模块
const userinfoHandler = require('../router_handle/user_info');

// 导入joi
const expressJoi = require("@escook/express-joi");
const {name_limit, email_limit} = require("../limit/users");

// 上传头像
router.post('/uploadAvatar', userinfoHandler.uploadAvatar);
// 绑定头像和账号
router.post('/bindAccount', userinfoHandler.bindAccount);
// 获取用户信息
router.post('/getUserInfo', userinfoHandler.getUserInfo);
// 修改姓名
router.post('/updateUserName', expressJoi(name_limit),userinfoHandler.updateUserName);
// 修改性别
router.post('/updateUserSex', userinfoHandler.updateUserSex);
// 修改邮箱
router.post('/updateUserEmail', expressJoi(email_limit), userinfoHandler.updateUserEmail);

module.exports = router;