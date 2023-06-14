import mysql from 'mysql';

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'mart',
    password : 'star0629',
    database : 'chatgpt10'
});

var sql = "CREATE TABLE articles (id INT AUTO_INCREMENT PRIMARY KEY, content TEXT, cate VARCHAR(255), cate_slug VARCHAR(255), keyword VARCHAR(255), vote INT, createdAt VARCHAR(255))";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("Table created");
});
