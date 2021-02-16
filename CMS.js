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
                        viewRole();
                        break;
                    case "employee":
                        viewEmployee();
                        break;
                    case "department":
                        connection.query("SELECT * FROM department", (err, res) => {
                            if (err) console.log(err);
                            console.log(`\n`)
                            console.table(res)
                            console.log(`\n`)
                        });

                        break;

                    default:
                        break;
                }

            };
        });
};

const viewRole = () => {
    connection.query(`SELECT * 
    FROM role
    INNER JOIN department ON (role.department_id = department.id)`, (err, res) => {
        if (err) console.log(err);
        console.log("Role View")
        console.table(res)
        console.log(`\n`)
        runManagement();
    });
};

const viewEmployee = () => {
    connection.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title, role.salary, CONCAT(Manager.first_name, ' ', Manager.last_name) AS 'Manager', employee.manager_id 
    FROM employee 
    INNER JOIN role ON (employee.role_id = role.id)
    LEFT JOIN employee AS Manager On (employee.manager_id = Manager.id);`, (err, res) => {
        if (err) console.log(err);
        console.log("Employee View")
        console.table(res)
        console.log(`\n`)
        runManagement();
    });
};