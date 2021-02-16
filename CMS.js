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

//connection and demo logs

connection.connect(err => {
    console.log("=========CONNECTED TO EMPLOYEE MANAGEMENT SYSTEM======")
    if (err) throw err;

    connection.query("SELECT * FROM employee_trackerdb.role", res => {
        console.table(res);
    });

    connection.query("SELECT * FROM employee_trackerdb.employee", res => {
        console.table(res);
    });

    connection.query("SELECT * FROM employee_trackerdb.department", res => {
        console.table(res);
    });

    runManagement();
});

function runManagement() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Welcome to the Employee Management System.  Select an action.",
            choices: [
                "View Data",
                "Add Data",
                "~~~EXIT~~~"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "View Data":

                    break;
                case "Add Data":
                    break;

                case "~~~EXIT~~~":
                    "EXITING EMPLOYEE CMS"
                    connection.end;
                    process.exit();
            };

        });
};