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
    console.log("===================================================")
    console.log("======CONNECTED TO EMPLOYEE MANAGEMENT SYSTEM======")
    console.log("===================================================")
    if (err) throw err;
    //Start program
    runManagement();
});

/////////
//INQUIRER MENUS
/////////

const runManagement = async () => {
    let answer = await inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "======= \n ==Select an action. \n =======",
            choices: [
                "View Employees",
                "View Roles",
                "View Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update employee role",
                "~~~EXIT~~~"
            ]
        })

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
        case "~~~EXIT~~~":
            "EXITING EMPLOYEE CMS"
            //end connection and exit program
            connection.end;
            process.exit();
    };
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

const addEmployee = async () => {

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

    await inquirer
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
        ]).then(async (ans) => {

            const { firstName, lastName, roleId } = ans;

            connection.query(`INSERT INTO employee (first_name, last_name, role_id) 
            VALUES ('${firstName}', '${lastName}', '${roleId}')`, (err, res) => {
                if (err)
                    throw error;
            });

            console.log(`${firstName} ${lastName} added.`, '\n');
            return await runManagement();
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
        ]).then(async ans => {
            let { title, salary, department_id } = ans;

            connection.query(`INSERT INTO role (title, salary, department_id) 
            VALUES ('${title}', '${salary}', '${department_id}')`, (err, res) => {
                if (err) throw error;
                console.log(`The role ${title} with a salary of ${salary} has been added.`, '\n');
            });
            return await runManagement();
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
        ]).then(async ans => {
            let { name } = ans;

            connection.query(`INSERT INTO department (name) 
            VALUES ('${name}')`, (err, res) => {
                if (err) throw error;
                console.log(`The ${name} department has been created`, '\n');
            });
            return await runManagement();
        });
};

////////////
//UPDATE FUNCTIONS
///////////

const updateEmployee = async () => {

    connection.query("SELECT first_name, last_name FROM employee", (err, res) => {
        if (err) console.log(err);
        let employeeChoices = [];

        res.map((element, index) => {
            let person = element.first_name + " " + element.last_name;
            //offset index to produce DB id
            let eid = index + 1;
            employeeChoices.push({ name: person, value: eid });
        });

        connection.query("SELECT role.title FROM role", (err, res) => {
            if (err) console.log(err);;

            let roles = [];
            res.map((r, index) => {
                let title = r.title;
                //offset index to produce DB id
                let id = index + 1;
                roles.push({ name: title, value: id });
            })

            inquirer
                .prompt([
                    {
                        name: "employeeId",
                        type: "list",
                        message: "Select an employee to update: ",
                        choices: employeeChoices,
                    },
                    {
                        name: "roleId",
                        type: "list",
                        message: "Select their new role: ",
                        choices: roles,
                    }
                ]).then((ans, err) => {
                    if (err) throw err;

                    const { roleId, employeeId } = ans;
                    console.log(ans);


                    connection.query(`UPDATE employee SET role_id = ?  WHERE id = ?`,
                        [roleId, employeeId], (err) => {
                            if (err) throw err;
                            console.log("Updating the values: ", { roleId, employeeId }, "\n")
                            return runManagement();
                        });


                });

        })
    });

}