INSERT INTO department (name)
VALUES
    ("Leadership"),
    ("Engineering"),
    ("Housekeeping"),
    ("F&B"),
    ("Front Desk");

INSERT INTO role (title, salary, department_id)
VALUES
    ("General Manager", 100000, 1),
    ("Director of Sales", 80000, 1),
    ("Assistant General Manager", 80000, 1),
    ("Operations Manager", 70000, 1),
    ("Engineer", 40000, 2),
    ("Room Attendant", 40000, 3),
    ("Laundry Attendant", 40000, 3),
    ("Bartender", 35000, 4),
    ("Front Desk Attendant", 50000, 5),
    ("Night Auditor", 60000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Larissa", "Mccann", 1, NULL),
    ("Caitlyn", "Martin", 2, 1),
    ("Trystan", "Hendricks", 3, 1),
    ("Rico", "Dennis", 4, 1),
    ("Melody", "Ayala", 5, 4),
    ("Jeremiah", "Sampson", 5, 4),
    ("Harold", "Richard", 6, 4),
    ("Keria", "Horne", 6, 4),
    ("Krish", "Berry", 7, 4),
    ("Esther", "Neal", 7, 4),
    ("Jemima", "Holder", 8, 4),
    ("Hassan", "Ingram", 8, 4),
    ("Daniela", "Coleman", 9, 3),
    ("Nina", "Proctor", 9, 3),
    ("Marco", "Wilkerson", 10, 3),
    ("Wyatt", "Oliver", 10, 3);
