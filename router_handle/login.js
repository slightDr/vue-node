const db = require('../db/index.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_config = require("../jwt_config/index.js");
const joi = require("joi");

/**
 * 注册功能
 */
exports.register = function (req, res) {
    // req: 前端传来的数据, res: 后端返回的数据
    const reg_info = req.body;

    // 判断信息是否齐全
    if (!reg_info.account || !reg_info.password) {
        return res.send({
            status: 1,
            message: "账号或密码不能为空",
        })
    }

    // 判断是否已经有同样的账号
    let sql = 'select * from users where account = ?';
    db.query(sql, reg_info.account, (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.length > 0) {
            return res.send({
                status: 1,
                message: "账号已存在",
            })
        }
        // 对帐号密码加密，使用加密中间件bcrypt
        reg_info.password = bcrypt.hashSync(reg_info.password, 10);

        // 加入数据表中
        sql = 'insert into users values(null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const identity = "用户";
        const create_time = new Date();
        const params = [reg_info.account, reg_info.password, identity, null, null, null, null, null, create_time, create_time, 0];
        db.query(sql, params, (err, result) => {
            if (err) {
                return res.cc(err);
            }
            if (result.affectedRows !== 1) {  // 影响行数不为 1
                return res.send({
                    status: 1,
                    message: "注册账号失败",
                })
            }
            res.send({
                status: 0,
                message: "注册账号成功",
            })
        })
    })
}

/**
 * 登录功能
 */
exports.login = function (req, res) {
    // res.send("登录");
    const login_info = req.body;

    // 查看数据库是否有账号
    let sql = "select * from users where account = ?";
    db.query(sql, login_info.account, (err, result) => {
        if (err) {
            return res.cc(err); // 一般是数据库断开
        }
        if (result.length <= 0) {
            return res.cc("账号未注册");
        }
        // 对密码进行解密
        const compareResult = bcrypt.compareSync(login_info.password, result[0].password);
        if (!compareResult) {
            return res.cc("密码错误");
        }
        // 判断账号是否冻结
        if (result[0].status === 1) {
            return res.cc("账号已冻结");
        }
        // 第四步，返回token，剔除加密后的密码/头像/创建更新时间
        const user = {
            ...result[0],  // 将 result[0] 对象的所有属性展开并复制到新的 user 对象中
            password: "",  // 这些属性将覆盖 result[0] 对象中相应的属性（如果存在），或者添加新的属性
            imageUrl: "",
            create_time: "",
            update_time: "",
        }
        const tokenStr = jwt.sign(user, jwt_config.jwtSecret, {
            expiresIn: "1h", // token有效时长1小时
        });
        res.send({
            results: result[0],
            status: 0,
            message: "登陆成功",
            token: "Bearer " + tokenStr,
        })
    })
}