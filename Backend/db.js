import mysql from 'mysql';

// Importing module
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'mart',
    password : 'star0629',
});

// Connecting to database
connection.connect(function (err) {
    if (err) {
        console.log("Error in the connection")
        console.log(err)
    }
    else {
        console.log(`Database Connected`)
        connection.query("CREATE DATABASE chatgpt10", function (err, result) {
        if (err) throw err;
            console.log("Database created");
        });
    }
})