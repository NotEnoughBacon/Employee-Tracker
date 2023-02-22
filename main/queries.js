const MySQL = require('mysql2');

require('dotenv').config();

const db = MySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '159753jaK07082001!',
        database: 'employees_db'
    },
    console.log('Connected to database')    
);

async function toArray(input, queryTarget) {

    let data = await caseQuery(input);

    let returnArr = [];

    data[0].forEach( (row) => {

        returnArr.push(row[queryTarget]);
    });

    return returnArr;
}

function caseQuery(input) {

    return db.promise().query(input);
};

function addDepartment(input) {

    db.query(`INSERT INTO departments (name) VALUES (?)`, input, (err) => {
        if (err) console.log(err);
    });
}

function addRole(name, salary, dept) {

    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [name, salary, dept], (err) => {
        if (err) console.log(err);
    });
}

function addEmployee(firstName, lastName, role, manager) {

    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, role, manager], (err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    caseQuery: caseQuery,
    addDepartment: addDepartment,
    addRole: addRole,
    toArray: toArray,
    addEmployee: addEmployee
}