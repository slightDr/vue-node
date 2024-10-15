// 导入express框架
const express = require("express");
// 创建express实例
const app = express();

// 导入body-parser
var bodyParser = require("body-parser");

// 导入cors
const cors = require("cors");

// 全局挂载
app.use(cors());
app.use(bodyParser.json()); // 处理json格式
app.use(bodyParser.urlencoded({ extended: false })); // extended=false时，为数组或者字符串；否则可以是任意类型

const loginRouter = require("./router/login.js");
app.use('/api', loginRouter);

app.listen(3000, () => {
    console.log("Server started on port 3000 hhhh!");
});