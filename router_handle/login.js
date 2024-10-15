const db = require('../db/index.js');
const bcrypt = require("bcrypt");
// const bcrypt = require('bcrypt')

exports.register = function (req, res) {  // req: 前端传来的数据, res: 后端返回的数据
    // res.send("注册");
    console.log(req.body);
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
        if (result.length > 0) {
            return res.send({
                status: 1,
                message: "账号已存在",
            })
        }
    })

    // 对帐号密码加密，使用加密中间件bcrypt
    reg_info.password = bcrypt.hashSync(reg_info.password, 10);

    // 加入数据表中
    sql = 'insert into users set ?';
    const identity = "用户";
    const create_time = new Date();
    db.query(sql, {
        account: reg_info.account,
        password: reg_info.password,
        identity: identity,
        create_time: create_time,
        status: 0, // 未冻结状态为0
    }, (err, result) => {
        if (result.affectedRows !== 1) {  // 影响行数不为 1
            return res.send({
                status: 1,
                message: "注册账号失败",
            })
        }
        res.send({
            status: 1,
            message: "注册账号成功",
        })
    })
}

exports.login = function (req, res) {
    res.send("登录");
}