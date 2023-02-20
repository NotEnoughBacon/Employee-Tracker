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

function caseQuery(input) {

    return db.promise().query(input);
};

function addDepartment(input) {

    db.query(`INSERT INTO departments (name) VALUES (?)`, input, (err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    caseQuery: caseQuery,
    addDepartment: addDepartment
}