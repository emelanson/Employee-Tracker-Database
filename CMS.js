var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_trackerdb"
});

connection.connect(err => {
    console.log("======CONNECTED TO EMPLOYEE MANAGEMENT SYSTEM======")
    if (err) throw err;
    //Start program
    runManagement();
});

/////////
//INQUIRER MENUS
/////////

const runManagement = () => {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Welcome to the Employee Management System.  Select an action.",
            choices: [
                "View Employees",
                "View Roles",
                "View Departments",
                "Add Data",
                "~~~EXIT~~~"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "View Employees":
                    viewEmployee();
                    break;
                case "View Roles":
                    viewRole();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "Add Data":
                    addData();
                    break;
                case "~~~EXIT~~~":
                    "EXITING EMPLOYEE CMS"
                    //end connection and exit program
                    connection.end;
                    process.exit();
            };
        });
};

const addData = () => {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Welcome to the Employee Management System.  Select an action.",
            choices: [
                "Add Employee",
                "Add Role",
                "Add Department",
                "~~~BACK~~~"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    viewRole();
                    break;
                case "Add Department":
                    viewDepartments();
                    break;
                case "~~~BACK~~~":
                    runManagement();
                    break;
            };
        });
};



////////////
//VIEW FUNCTIONS
////////////

const viewRole = () => {
    connection.query(`SELECT role.title, role.salary, department.name AS "Department Name"
    FROM role
    INNER JOIN department ON (role.department_id = department.id)`, (err, res) => {
        if (err) console.log(err);
        console.log("Role View")
        console.table(res)
        console.log(`\n`)
        runManagement();
    });
};

const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) console.log(err);
        console.log(`\n`)
        console.table(res)
        console.log(`\n`)
        runManagement();
    });
};

const viewEmployee = () => {
    connection.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title, department.name AS "Department Name", role.salary, CONCAT(Manager.first_name, ' ', Manager.last_name) AS 'Manager', employee.manager_id 
    FROM employee 
    INNER JOIN role ON (employee.role_id = role.id)
    INNER JOIN department ON (role.department_id = department.id)
    LEFT JOIN employee AS Manager On (employee.manager_id = Manager.id);`, (err, res) => {
        if (err) console.log(err);
        console.log("Employee View")
        console.table(res)
        console.log(`\n`)
        runManagement();
    });
};

/////////
//ADD FUNCTIONS
/////////

const addEmployee = () => {

    var choices = [];

    connection.query("SELECT role.title FROM role", (err, res) => {
        if (err) console.log(err);;
        res.forEach(element => {
            choices.push(element.title)
        });
    })

    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "Enter employee's first name: ",
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter employee's Last name: ",
            },
            {
                name: "role",
                type: "list",
                message: "Select the employee's role: ",
                choices: choices,
            }
        ]).then(ans => {

            const { first_name, last_name, role } = ans;

            let roleId = choices.findIndex(e => {
                return e == role;
            });

            //offset index
            roleId += 1;

            connection.query(`INSERT INTO employee (first_name, last_name, role_id) 
            VALUES ('${first_name}', '${last_name}', '${roleId}')`, (err, res) => {
                if (err) throw error;
                console.log(`${first_name} ${last_name} the ${role} has been added.`);
            });
            runManagement();
        });

};