// Imports
const inq = require("inquirer");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

//Start function for CLI
start();

//Functions
function start() {
  inq
    .prompt({
      type: "list",
      name: "main",
      message: "What would you like to do",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit",
      ],
    })
    .then((response) => {
      let res = response.main;
      switch (res) {
        case "View all Departments":
          viewAllDep();
          break;
        case "View all Roles":
          viewAllRole();
          break;
        case "View all Employees":
          viewAllEmp();
          break;
        case "Add a Department":
          addDep();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmp();
          break;
        case "Update an Employee Role":
          updateRole();
          break;
        case "Quit":
          process.exit();
        default:
          console.log(response);
      }
    });
}

function viewAllDep() {
  db.promise()
    .query(`SELECT * FROM department`)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => start());
}

function viewAllRole() {
  db.promise()
    .query(
      `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    LEFT JOIN department on role.department_id = department.id 
    ORDER BY department`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => start());
}

function viewAllEmp() {
  return db
    .promise()
    .query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, e2.first_name AS manager 
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee e2 on employee.manager_id = e2.id
    ORDER BY title;`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => start());
}

function addDep() {
  inq
    .prompt({
      type: "input",
      name: "dep",
      message: "What is the name of the new department?",
    })
    .then((response) => {
      let res = response.dep;
      return db
        .promise()
        .query(`INSERT INTO department (name) VALUES ("${res}")`);
    })
    .then(() => start());
}

function addRole() {
  return db
    .promise()
    .query(`SELECT * FROM department`)
    .then(([rows, fields]) => {
      let deps = rows;
      let depParams = deps.map(({ id, name }) => ({
        value: id,
        name: name,
      }));
      console.log(depParams);

      inq
        .prompt([
          {
            type: "input",
            message: "What is the name of the new role?",
            name: "role",
          },
          {
            type: "input",
            message: "What is the salary of the new Role?",
            name: "salary",
          },
          {
            type: "list",
            message: "Which department does the role belong to?",
            name: "dep",
            choices: depParams,
          },
        ])
        .then((newRole) => {
          console.log(newRole);
          return db
            .promise()
            .query(
              `INSERT INTO role (title, salary, department_id) VALUES ("${newRole.role}", ${newRole.salary}, ${newRole.dep})`
            );
        })
        .then(() => start());
    });
}

function addEmp() {
  return db
    .promise()
    .query(`SELECT title, id FROM role`)
    .then(([rows, fields]) => {
      let roles = rows;
      let roleParams = roles.map(({ title, id }) => ({
        name: title,
        value: id,
      }));
      return roleParams;
    })
    .then((rolesList) => {
      return db
        .promise()
        .query(`SELECT id, first_name FROM employee`)
        .then(([rows, fields]) => {
          let emp = rows;
          let empParams = emp.map(({ id, first_name }) => ({
            name: first_name,
            value: id,
          }));

          return inq.prompt([
            {
              type: "input",
              message: "What is the new employee's first name?",
              name: "first",
            },
            {
              type: "input",
              message: "What is the new employee's last name?",
              name: "last",
            },
            {
              type: "list",
              message: "What is the new employee's role?",
              name: "role",
              choices: rolesList,
            },
            {
              type: "list",
              message: "Who is the new employee's manager?",
              name: "manager",
              choices: empParams,
            },
          ]);
        });
    })
    .then((newEmp) => {
      console.log(newEmp);

      return db.promise()
        .query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES ("${newEmp.first}", "${newEmp.last}", ${newEmp.role}, ${newEmp.manager})`);
    })
    .then(() => start());
}

function updateRole() {
  return db
    .promise()
    .query(`SELECT title, id FROM role`)
    .then(([rows, fields]) => {
      let roles = rows;
      let roleParams = roles.map(({ title, id }) => ({
        name: title,
        value: id,
      }));
      return roleParams;
    })
    .then((rolesList) => {
      return db
        .promise()
        .query(`SELECT first_name FROM employee`)
        .then(([rows, fields]) => {
          let emp = rows;
          let empParams = emp.map(({ first_name }) => ({
            name: first_name,
          }));

          return inq.prompt([
            {
              type: "list",
              message: "Which employee's role would you like to update?",
              name: "emp",
              choices: empParams,
            },
            {
              type: "list",
              message: "What is the employee's new role?",
              name: "role",
              choices: rolesList,
            },
          ]);
        });
    })
    .then((newRole) => {
      console.log(newRole);

      return db.promise().query(`UPDATE employee
            SET role_id = ${newRole.role}
            WHERE first_name = "${newRole.emp}"`);
    })
    .then(() => start());
}
