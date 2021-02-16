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
                    viewData();
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

function viewData() {
    inquirer
        .prompt({
            name: "data",
            type: "rawlist",
            message: "What category of data would you like to view?",
            choices: [
                "role",
                "employee",
                "department",
                "Go Back"
            ]
        })
        .then(answer => {
            if (answer.data !== "Go Back") {
                let query = answer.data;

                switch (answer.data) {
                    case "role":
                        connection.query("SELECT * FROM role", (err, res) => {
                            if (err) console.log(err);
                            console.table(res)
                        });
                        break;
                    case "employee":
                        connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id)", query, (err, res) => {
                            if (err) console.log(err);
                            console.table(res)
                        });

                        break;
                    case "department":
                        connection.query("SELECT * FROM role", (err, res) => {
                            if (err) console.log(err);
                            console.table(res)
                        });

                        break;

                    default:
                        break;
                }

            };
            runManagement();
        });
};


//     connection.query("SELECT * FROM employee_trackerdb.role", res => {
//     console.table(res);
// });

// connection.query("SELECT * FROM employee_trackerdb.employee", res => {
//     console.table(res);
// });

// connection.query("SELECT * FROM employee_trackerdb.department", res => {
//     console.table(res);
// });
