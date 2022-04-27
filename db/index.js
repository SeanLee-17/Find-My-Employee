const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  findAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT department.id, department.name FROM department;");
  }

  findAllRoles() {
    return this.connection
      .promise()
      .query(
        "SELECT role.id, role.title, role.salary, role.department_id FROM role;"
      );
  }

  findAllEmployees() {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee;"
      );
  }

  createDepartment(department) {
    return this.connection
      .promise()
      .query("INSERT INTO department SET ?", department);
  }

  createRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  createEmployee(employee) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET ?", employee);
  }

  updateRole(role_id, employee_id) {
    return this.connection
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        role_id,
        employee_id,
      ]);
  }
}

module.exports = new DB(connection);
