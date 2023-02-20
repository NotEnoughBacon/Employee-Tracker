const MySQL = require('mysql2');

require('dotenv').config();

const db = MySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connected to database')    
);

function caseQuery(input) {

    return db.promise().query(input);
};

