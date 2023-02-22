const MySQL = require('mysql2');

//creates connection with the db
const db = MySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '', //Add password here
        database: 'employees_db'
    },
    console.log('Connected to database')    
);

//takes in a query to convert it into an array to be used with the prompts
async function toArray(input, queryTarget) {

    let data = await caseQuery(input);

    let returnArr = [];

    data[0].forEach( (row) => {

        returnArr.push(row[queryTarget]);
    });

    return returnArr;
}

//Just takes in a query and returns the promise version
function caseQuery(input) {

    return db.promise().query(input);
};

//the query to add a department using inputs from the user
function addDepartment(input) {

    db.query(`INSERT INTO departments (name) VALUES (?)`, input, (err) => {
        if (err) console.log(err);
    });
}

//the query to add a role using inputs from the user
function addRole(name, salary, dept) {

    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [name, salary, dept], (err) => {
        if (err) console.log(err);
    });
}

//the query to add an employee using inputs from the user
function addEmployee(firstName, lastName, role, manager) {

    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, role, manager], (err) => {
        if (err) console.log(err);
    });
}

//exporting all the functions
module.exports = {
    caseQuery: caseQuery,
    addDepartment: addDepartment,
    addRole: addRole,
    toArray: toArray,
    addEmployee: addEmployee
}