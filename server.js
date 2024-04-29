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
          update();
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
    .query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id`)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => start());
}

function viewAllEmp() {
  return db
    .promise()
    .query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;`
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
        id: id,
        name: name,
      }));

      inq.prompt([
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
          choices: depParams
        }
      ]).then (newRole => {
        console.log(newRole)
        return db.promise().query(`INSERT INTO role (title, salary) VALUES ("${newRole.role}", ${newRole.salary})`)
      }).then(() => start());
})
    
};

function addEmp() {
    return db
    .promise()
    .query(`SELECT * FROM role`)
    .then(([rows, fields]) => {
      let roles = rows;
      let roleParams = roles.map(({ id, title, department_id }) => ({
        id: id,
        title: title,
        depId: department_id
      })); console.log(roleParams)
    
    inq.prompt([
        {
          type: "input",
          message: "What is the new employee's first name?",
          name: "first"
        },
        {
          type: "input",
          message: "What is the new employee's last name?",
          name: "last"
        },
        {
            type: "list",
            message: "What is the new employee's role?",
            name: "role",
            choices: roleParams.title
        }
        ]).then (newEmp => {
            console.log(newEmp)
        })
})}

// QUESTIONS
// How can I get department ID on line 144
// How can I get into role titles on line 177
// How can I pull more information for addEmp (I need manager)
// Show all employees showing managers are an ID