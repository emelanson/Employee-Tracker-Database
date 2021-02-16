var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employee_trackerdb"
});

connection.connect(function (err) {
    console.log("=========CONNECTED TO EMPLOYEE MANAGEMENT SYSTEM======")
    if (err) throw err;

    connection.query("SELECT * FROM employee_trackerdb.role", function (err, res) {
        console.table(res);
    });

    connection.query("SELECT * FROM employee_trackerdb.employee", function (err, res) {
        console.table(res);
    });

    connection.query("SELECT * FROM employee_trackerdb.department", function (err, res) {
        console.table(res);
    });
});
