const express = require("express");
const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
const { title } = require("process");
const db = require("./db");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const database = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "yajirushi17",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// Query database
database.query("SELECT * FROM students", function (err, results) {
  console.log(results);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "Choose an option: ",
        choices: [
          {
            name: "View All Departments",
            value: "VIEW_DEPARTMENTS",
          },
          {
            name: "View All Roles",
            value: "VIEW_ROLES",
          },
          {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "Add a Department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "Add a Role",
            value: "ADD_ROLE",
          },
          {
            name: "Add an Employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "Update an Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE",
          },
        ],
      },
    ])
    .then((res) => {
      let choice = res.choices;
      console.log(res.choices);
      if (choice === "VIEW_DEPARTMENTS") {
        viewDepartments();
      } else if (choice === "VIEW_ROLES") {
        viewRoles();
      } else if (choice === "VIEW_EMPLOYEES") {
        viewEmployees();
      } else if (choice === "ADD_DEPARTMENT") {
        addDepartments();
      } else if (choice === "ADD_ROLE") {
        addRoles();
      } else if (choice === "ADD_EMPLOYEE") {
        addEmployees();
      } else if (choice === "UPDATE_EMPLOYEE_ROLE") {
        updateEmployeeRole();
      }
    });
};

const viewDepartments = () => {
  db.findAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.table(departments);
    })
    .then(() => mainMenu());
};

const viewRoles = () => {
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      console.table(roles);
    })
    .then(() => mainMenu());
};

const viewEmployees = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.table(employees);
    })
    .then(() => mainMenu());
};

const addEmployees = () => {
  db.findAllRoles().then(([rows]) => {
    let roles = rows;
    const rolos = roles.map(({ title, id }) => {
      return {
        name: title,
        value: id,
      };
    });
    db.findAllEmployees().then(([rows]) => {
      let employees = rows;
      const empos = employees.map(({ first_name, last_name, id }) => {
        return {
          name: `${first_name} ${last_name}`,
          value: id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What's the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role_id",
            message: "What's the employee's role?",
            choices: rolos,
          },
        ])
        .then((employee) =>
          db
            .createEmployee(employee)
            .then(() =>
              console.log(
                `added the employee ${employee.first_name} ${employee.last_name}`
              )
            )
            .then(() => mainMenu())
        );
    });
  });
};

const addDepartments = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What's the department's name?",
      },
    ])
    .then((department) =>
      db
        .createDepartment(department)
        .then(() => console.log(`Added the department ${department.name}`))
        .then(() => mainMenu())
    );
};

const addRoles = () => {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const depos = departments.map(({ name, id }) => {
      return {
        name: name,
        value: id,
      };
    });
    db.findAllRoles().then(([rows]) => {
      let roles = rows;
      const rolos = roles.map(({ title, id }) => {
        return {
          name: title,
          value: id,
        };
      });

      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What's the role's title?",
          },
          {
            type: "input",
            name: "salary",
            message: "What's the role's salary?",
          },
          {
            type: "list",
            name: "department_id",
            message: "What's the role's department?",
            choices: depos,
          },
        ])
        .then((role) =>
          db
            .createRole(role)
            .then(() => console.log(`added the role ${role.title}`))
            .then(() => mainMenu())
        );
    });
  });
};

const updateEmployeeRole = () => {
  db.findAllEmployees().then(([rows]) => {
    let employees = rows;
    const empos = employees.map(({ first_name, last_name, id }) => {
      return {
        name: `${first_name} ${last_name}`,
        value: id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which employee would you like to update?",
          choices: empos,
        },
      ])
      .then((res) => {
        let employee_id = res.id;

        db.findAllRoles().then(([rows]) => {
          let roles = rows;
          const rolos = roles.map(({ title, id }) => {
            return {
              name: title,
              value: id,
            };
          });
          inquirer
            .prompt([
              {
                type: "list",
                name: "role_id",
                message: "Which role would you like to assign?",
                choices: rolos,
              },
            ])
            .then((res) => db.updateRole(res.role_id, employee_id))
            .then(() => console.log("Updated Employee Role"))
            .then(() => mainMenu());
        });
      });
  });
};

const init = () => {
  mainMenu();
};

init();
