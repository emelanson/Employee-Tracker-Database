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
                "Add/Update Data",
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
                case "Add/Update Data":
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
            message: "Choose a category of data to add or update",
            choices: [
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update employee role",
                "~~~BACK~~~"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Update employee role":
                    updateEmployee();
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

    let choices = [];

    connection.query("SELECT role.title FROM role", (err, res) => {
        if (err) console.log(err);;
        res.forEach((element, index) => {
            let title = element.title;
            //offset index to produce DB id
            let id = index + 1;
            choices.push({ name: title, value: id });
        });
    });

    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter employee's first name: ",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter employee's Last name: ",
            },
            {
                name: "roleId",
                type: "list",
                message: "Select the employee's role: ",
                choices: choices,
            }
        ]).then(ans => {

            const { firstName, lastName, roleId } = ans;

            connection.query(`INSERT INTO employee (first_name, last_name, role_id) 
            VALUES ('${firstName}', '${lastName}', '${roleId}')`, (err, res) => {
                if (err) throw error;
                console.log(`${firstName} ${lastName} added.`, '\n');
            });
            runManagement();
        });

};

const addRole = () => {
    let choices = [];

    connection.query("SELECT department.name FROM department", (err, res) => {
        if (err) console.log(err);;
        res.forEach((element, index) => {
            let dep = element.name;
            //offset index to produce DB id
            let id = index + 1;
            choices.push({ name: dep, value: id });
        });
    });

    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "Enter a title for the new role: ",
            },
            {
                name: "salary",
                type: "number",
                message: "Enter a Salary for the new role: ",
            },
            {
                name: "department_id",
                type: "list",
                message: "Select a department for the role to belong to: ",
                choices: choices,
            }
        ]).then(ans => {
            let { title, salary, department_id } = ans;

            connection.query(`INSERT INTO role (title, salary, department_id) 
            VALUES ('${title}', '${salary}', '${department_id}')`, (err, res) => {
                if (err) throw error;
                console.log(`The role ${title} with a salary of ${salary} has been added.`, '\n');
            });
            runManagement();
        });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Enter a name for the new department: ",
            },
        ]).then(ans => {
            let { name } = ans;

            connection.query(`INSERT INTO department (name) 
            VALUES ('${name}')`, (err, res) => {
                if (err) throw error;
                console.log(`The ${name} department has been created`, '\n');
            });
            runManagement();
        });
};

////////////
//UPDATE FUNCTIONS
///////////

function updateEmployee() {
    let employeeChoices = [];
    let roleChoices = [];

    connection.query("SELECT first_name, last_name FROM employee", (err, res) => {
        if (err) console.log(err);

        res.forEach((element, index) => {
            let person = element.first_name + " " + element.last_name;
            //offset index to produce DB id
            let eid = index + 1;
            employeeChoices.push({ name: person, value: eid });
        });
    });

    connection.query("SELECT role.title FROM role", (err, res) => {
        if (err) console.log(err);;
        res.forEach((element, index) => {
            let title = element.title;
            //offset index to produce DB id
            let id = index + 1;
            roleChoices.push({ name: title, value: id });
        });
    });

    inquirer
        .prompt([
            //For some reason I need this first prompt???  Tried lots of async options without it and it doesn't work as expected.
            {
                name: "update",
                type: "confirm",
                message: "Enter any key"
            },
            {
                name: "employeeid",
                type: "list",
                message: "Select an employee to update: ",
                choices: employeeChoices,
            },
            {
                name: "roleid",
                type: "list",
                message: "Select their new role: ",
                choices: roleChoices,
            }
        ]).then(ans => {
            let { roleid, employeeid } = ans;
            console.log("Updating the values: ", { roleid, employeeid })

            connection.query(`UPDATE employee SET role_id ? WHERE employeeid ?
            VALUES ('${roleid}', '${employeeid}')`, (err, res) => {
                if (err) throw error;
            });
            runManagement();
        });
}