const db = require('../db/index.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_config = require("../jwt_config/index.js");
const joi = require("joi");
// crypto生成uuid
const crypto = require("crypto");
// 处理文件路径
fs = require('fs');

// 上传头像
exports.uploadAvatar = (req, res) => {
    // 检查是否有文件上传
    if (!req.files || req.files.length === 0) {
        return res.send({
            status: 1,
            message: "请至少上传一张图片",
        });
    }

    const only_id = crypto.randomUUID()  // 唯一标识
    let old_name = req.files[0].filename;
    let new_name = Buffer.from(req.files[0].originalname, "utf8").toString("utf8");
    fs.renameSync('./public/uploads/' + old_name, './public/uploads/' + new_name);
    const sql = 'insert into images values(null, ?, null, ?)'
    const params = [`http://127.0.0.1:3000/uploads/${new_name}`, only_id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.cc(err);
        }
        res.send({
            only_id: only_id,
            image_url: `http://127.0.0.1:3000/uploads/${new_name}`,
            status: 0,
        });
    });
}

// 绑定账号: only_id, account, url
exports.bindAccount = (req, res) => {
    const { only_id, account, url } = req.body;
    let sql = 'update images set account = ? where only_id = ?';
    db.query(sql, [account, only_id], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.affectedRows === 1) {
            sql = 'update users set image_url = ? where account = ?';
            db.query(sql, [url, account], (err, result) => {
                if (err) {
                    return res.cc(err);
                }
                res.success("修改成功");
            });
        }
    });
}

// 修改密码：id, old_pwd, new_pwd
exports.updatePassword = (req, res) => {
    let sql = "select password from users where id = ?"
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.cc(err);
        }

        // 解密密码
        const compare = bcrypt.compareSync(req.body.old_pwd, result[0].password);
        if (!compare) {
            return res.cc("密码验证失败", 1);
        }
        let new_pwd = bcrypt.hashSync(req.body.new_pwd, 10);
        sql = "update users set password = ? where id = ?";
        db.query(sql, [new_pwd, req.body.id], (err, result) => {
            if (err) {
                return res.cc(err);
            }
            res.success("修改成功");
        })
    });
}

// 获取用户信息: id
exports.getUserInfo = (req, res) => {
    const sql = 'select * from users where id = ?';
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.cc(err);
        }
        res.send({
            status: 0,
            payload: result,
        })
    })
}

// 修改姓名: id, name
exports.updateUserName = (req, res) => {
    const { id, name } = req.body;
    const sql = 'update users set name = ? where id = ?';
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        res.send({
            status: 0,
            message: "修改成功",
        });
    });
}

// 修改性别: id, sex
exports.updateUserSex = (req, res) => {
    const { id, sex } = req.body;
    const sql = 'update users set sex = ? where id = ?';
    db.query(sql, [sex, id], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        res.send({
            status: 0,
            message: "修改成功",
        });
    });
}

// 修改邮箱: id, email
exports.updateUserEmail = (req, res) => {
    const { id, email } = req.body;
    const sql = 'update users set email = ? where id = ?';
    db.query(sql, [email, id], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        res.send({
            status: 0,
            message: "修改成功",
        });
    });
}

// 验证账号与邮箱是否一致: account email
exports.verifyAccountEmail = (req, res) => {
    const { account, email } = req.body;
    const sql = "select email from users where account = ?"
    db.query(sql, [account], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.length <= 0) {
            return res.cc("该账号未注册");
        }
        if (email === result[0].email) {
            res.success("验证成功");
        } else {
            res.cc("验证失败");
        }
    })
}

// 登陆页面修改密码: account, new_pwd
exports.updateUserPassword = (req, res) => {
    const new_pwd = bcrypt.hashSync(req.body.new_pwd, 10);
    const sql = "update users set password = ? where account = ?";
    db.query(sql, [new_pwd, req.body.account], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.affectedRows === 1) {
            return res.success("修改密码成功");
        }
        res.cc("修改密码失败");
    })
}