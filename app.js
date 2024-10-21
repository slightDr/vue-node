// 导入express框架
const express = require("express");
// 创建express实例
const app = express();

// 导入body-parser
var bodyParser = require("body-parser");

// 导入cors
const cors = require("cors");
const jwt_config = require("./jwt_config/index.js");
const { expressjwt: jwt } = require("express-jwt");
const Joi = require("joi");

// 导入multer
const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });

// 全局挂载
app.use(cors()); // 处理跨域
app.use(bodyParser.json()); // 处理json格式
app.use(bodyParser.urlencoded({ extended: false })); // extended=false时，为数组或者字符串；否则可以是任意类型
app.use(upload.any());  // 使用multer中间件
app.use(express.static("./public"));  // 静态托管
app.use(jwt({  // jwt验证中间件
    secret: jwt_config.jwtSecret,
    algorithms: ["HS256"],
}).unless({ // 排除需要token的路径
    path: [
        /^\/api\//,  // localhost:3000/api
        /^\/user\//,  // localhost:3000/user
    ],
}));
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
});

// 登录路由
const loginRouter = require("./router/login.js");
app.use('/api', loginRouter);
app.use((err, req, res, next) =>  {
    if (err instanceof Joi.ValidationError) {
        res.cc("请检查数据格式", status=2);
    }
    next();
});

// 用户详情路由
const userInfoRouter = require("./router/user_info.js");
app.use('/user', userInfoRouter);
app.use((err, req, res, next) =>  {
    if (err instanceof Joi.ValidationError) {
        res.cc("请检查数据格式", status=2);
    }
    next();
});

app.listen(3000, () => {
    console.log("Server started on port 3000 hhhh!");
});