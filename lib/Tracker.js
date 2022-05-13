// Get Libraries
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require('mysql2');

// Global Variable to Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Nambucca1',
    database: 'tracker_db'
  },
  console.log(`Connected to the tracker_db database.`)
);

// The Tracker class is responsible for the running of the program

class Tracker {
  // Save a reference for `this` in `this` as `this` will change inside of inquirer
  constructor() {

    // Log the title of the program
    console.log(`%c
     ______                 _                         __  __                                   
    |  ____|               | |                       |  \\/  |                                  
    | |__   _ __ ___  _ __ | | ___  _   _  ___  ___  | \\  / | __ _ _ __   __ _  __ _  ___ _ __ 
    |  __| | '_   _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ | |\\/| |/ _  | '_ \\ / _  |/ _  |/ _ \\ '__|
    | |____| | | | | | |_) | | (_) | |_| |  __/  __/ | |  | | (_| | | | | (_| | (_| |  __/ |   
    |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___| |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
                     | |             __/ |                                      __/ |          
                     |_|            |___/                                      |___/          `);


  }

  startTracker() {

    // Ask the inquirer questions
    const startupQuestions = [
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'startupChoice',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
      }
    ];

    inquirer
      .prompt(startupQuestions)
      .then((response) => {

        // Take the Users Choice and run the corresponding Method/Function
        switch (response.startupChoice) {
          case 'View All Employees':
            this.viewAllEmployees();
            break;
          case 'Add Employee':
            this.addEmployee();
            break;
          case 'Update Employee Role':
            this.updateEmployeeRole();
            break;
          case 'View All Roles':
            this.viewAllRoles();
            break;
          case 'Add Role':
            this.addRole();
            break;
          case 'View All Departments':
            this.viewAllDepartments();
            break;
          case 'Add Department':
            this.addDepartment();
            break;
          case 'Quit':
            this.quit();
            break;
        }
      })
  }

  viewAllEmployees() {
    // Query database
    let queryPromise = new Promise((resolve, reject) => {
      db.query('SELECT * FROM employees', function (err, results) {
        resolve(console.table(results));
      })
    })
      .then(() => { this.startTracker() })
  }

  addEmployee() {

    let currentFullNames;
    let currentRoles;
    let addEmployeeQuestions = [];

    let currentRolesPromise = this.getRoles();
    let currentFullNamesPromise = this.getFullNames();

    let promises = [currentRolesPromise, currentFullNamesPromise];
    Promise.all(promises)
      .then((data) => {
        currentRoles = data[0];
        currentFullNames = data[1];
      })
      .then(() => {
        addEmployeeQuestions = [{
          type: 'input',
          name: 'newEmployeefirst_name',
          message: "What is the first_name of the Employee",
        },
        {
          type: 'input',
          name: 'newEmployeelast_name',
          message: "What is the last_name of the Employee",
        },
        {
          type: 'list',
          name: 'newEmployeeRole',
          message: "What is the Role the Employee belongs to?",
          choices: currentRoles
        },
        {
          type: 'list',
          name: 'newEmployeeManager',
          message: "What is the Manager the Employee belongs to?",
          choices: currentFullNames
        }];

        inquirer.prompt(addEmployeeQuestions)
          .then((response) => {

            let thisEmployeeRoleId = 1 + parseInt((Object.keys(currentRoles).find(key => currentRoles[key] === response.newEmployeeRole)));
            let thisEmployeeManagerId = 1 + parseInt((Object.keys(currentFullNames).find(key => currentFullNames[key] === response.newEmployeeManager)));
            let queryPromise = new Promise((resolve, reject) => {
              db.query(`INSERT INTO Employees (first_name, last_name, role_id, manager_id)
          VALUES
              ( "${response.newEmployeefirst_name}","${response.newEmployeelast_name}" ,${thisEmployeeRoleId}, ${thisEmployeeManagerId});`, (err, result) => {
                if (err) {
                  console.log(err);
                }
                resolve(console.log(result));
              })
            })
          }).then(() => { this.startTracker() })
      })
  }

  updateEmployeeRole() {
    console.log('run updateEmployeeRole')
  }

  viewAllRoles() {
    // Query database
    let queryPromise = new Promise((resolve, reject) => {
      db.query('SELECT * FROM roles', function (err, results) {
        resolve(console.table(results));
      })
    })
      .then(() => { this.startTracker() })

  }

  addRole() {
    // Get list of current departments
    let listOfDepartments = [];
    let addRoleQuestions = [];
    let queryPromise = new Promise((resolve, reject) => {
      db.query('SELECT name FROM departments', function (err, results) {
        // Make a list of departments
        listOfDepartments = results.map((item) => item.name)

        resolve(console.log(listOfDepartments));
      })
    }).then(() => {
      addRoleQuestions = [{
        type: 'input',
        name: 'newRoleTitle',
        message: "What is the title of the Role",
      },
      {
        type: 'input',
        name: 'newRoleSalary',
        message: "What is the Salary of the Role",
      },
      {
        type: 'list',
        name: 'newRoleDepartment',
        message: "What is the Department the Role belongs to?",
        choices: listOfDepartments
      }];

      inquirer.prompt(addRoleQuestions)
        .then((response) => {

          let thisRoleDepartmentId = 1 + parseInt((Object.keys(listOfDepartments).find(key => listOfDepartments[key] === response.newRoleDepartment)));
          let queryPromise = new Promise((resolve, reject) => {
            db.query(`INSERT INTO Roles (title, salary, department_id)
            VALUES
                ( "${response.newRoleTitle}", ${response.newRoleSalary}, ${thisRoleDepartmentId});`, (err, result) => {
              if (err) {
                console.log(err);
              }
              resolve(console.log(result));
            })
          })
        }).then(() => { this.startTracker() })
    })
  }



  viewAllDepartments() {
    // Query database
    let queryPromise = new Promise((resolve, reject) => {
      db.query('SELECT * FROM departments', function (err, results) {
        resolve(console.table(results));
      })
    })
      .then(() => { this.startTracker() })
  }

  addDepartment() {
    const addDepartmentQuestions = [{
      type: 'input',
      name: 'newDepartmentName',
      message: "What is the name of the department",
    }];

    inquirer.prompt(addDepartmentQuestions)
      .then((response) => {
        let queryPromise = new Promise((resolve, reject) => {
          db.query(`INSERT INTO departments (name) VALUES ("${response.newDepartmentName}");`, (err, result) => {
            if (err) {
              console.log(err);
            }
            resolve(console.log(result));
          })
        })
      }).then(() => { this.startTracker() })

  }

  getFullNames() {
    // Query database
    return new Promise((resolve, reject) => {
      db.query('SELECT first_name, last_name FROM employees', function (err, results) {
        let fullNames = results.map((item) => item.first_name + ' ' + item.last_name)
        resolve(fullNames);
      })
    })
  }

  getDepartments() {
    // Query database
    return new Promise((resolve, reject) => {
      db.query('SELECT name FROM departments', function (err, results) {
        let departmentNames = results.map((item) => item.name)
        resolve(departmentNames);
      })
    })
  }

  getRoles() {
    // Query database
    return new Promise((resolve, reject) => {
      db.query('SELECT title FROM roles', function (err, results) {
        let roleNames = results.map((item) => item.title)
        resolve(roleNames);
      })
    })
  }



  // Logs goodbye and exits the node app
  quit() {
    console.log("Goodbye!");
    process.exit(0);
  }

}

module.exports = Tracker;