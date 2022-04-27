USE employee_db;

INSERT INTO department (name)
VALUES ("IT"),
       ("Finance"),
       ("Sales"),
       ("Marketing");


INSERT INTO role (title, salary, department_id)
VALUES ("IT Director", 500000, 1),
       ("Engineer", 125000, 2),
       ("Accounting", 140000, 2),
       ("The Sales Manager", 18, 3),
       ("Sales Development Rep", 45000, 3),
       ("Digital Marketing", 65000, 4),
       ("Distribution", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cristiano", "Ronaldo", 1, NULL),
       ("Andres", "Iniesta", 1, 1),
       ("Mesut", "Ozil", 2, 1),
       ("Lionel", "Messi", 2, 1),
       ("Diego", "Forlan", 3, NULL),
       ("Luis", "Nani", 3, 5),
       ("Zlatan", "Ibrahimovic", 4, NULL),
       ("Pepe", "Silva", 5, 7),
       ("Joao", "Cancelo", 6, 7),
       ("Bernardo", "Silva", 7, 7);

