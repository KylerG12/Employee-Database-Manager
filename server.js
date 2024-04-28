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

function start() {
inq.prompt({
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
    "Quit"
  ],
}).then((response) => {
    const res = response.main;
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
})};
start();


//Functions
function viewAllDep() {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        } 
    )
};