// 导入express框架
const express = require("express");
// 创建express实例
const app = express();

// 导入body-parser
var bodyParser = require("body-parser");

// 导入cors
const cors = require("cors");
const jwt_config = require("./jwt_config/index.js")
const { expressjwt: jwt } = require("express-jwt");
const Joi = require("joi");

// 全局挂载
app.use(cors());
app.use(bodyParser.json()); // 处理json格式
app.use(bodyParser.urlencoded({ extended: false })); // extended=false时，为数组或者字符串；否则可以是任意类型
app.use(jwt({
    secret: jwt_config.jwtSecret,
    algorithms: ["HS256"],
}).unless({ // 排除需要token的路径
    path: [
        /^\/api\//,  // localhost:3000/api
    ],
}))

// 处理错误的中间件
app.use((req, res, next) => {
    // status = 0成功，其他失败
    res.cc = (err, status=1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err, // 判断错误对象还是字符串
        })
    };
    next(); // 如果没有错误，继续走入路由
})

const loginRouter = require("./router/login.js");
app.use('/api', loginRouter);

// 对不符合joi规则的情况报错
app.use((req, res, next) => {
    if (err instanceof Joi.ValidationError) {
        return res.cc(err);
    }
    // next(); // 如果没有错误，继续走入路由
})

app.listen(3000, () => {
    console.log("Server started on port 3000 hhhh!");
});