// 导入mysql
const mysql = require('mysql')

// 创建连接
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "vue-node",
})

// 对外暴露
module.exports = db