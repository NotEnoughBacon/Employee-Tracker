const Inquirer = require('inquirer');
const Query = require('./queries');

function start() {

    Inquirer.prompt( [
        
        //main menu
        {
            name: 'mainMenu',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update employee role',
                'Quit'
            ]          
        }
    ]).then( async (answer) => {
        
        switch (answer.mainMenu) {

            case 'View all departments':

                let printDept = await Query.caseQuery(`SELECT * FROM departments`);

                console.table(printDept[0]);

                start();

                break;

            case 'View all roles':

                let rolesPrint = await Query.caseQuery(`
                SELECT 
                roles.id AS role_id,
                roles.title AS role_title,
                roles.salary AS role_salary,
                departments.name AS department_name
                FROM roles
                INNER JOIN departments 
                ON roles.department_id = departments.id
                `);

                console.table(rolesPrint[0]);

                start();

                break;

            case 'View all employees':

                let employeePrint = await Query.caseQuery(`
                SELECT
                employees.id AS employee_id,
                CONCAT (employees.first_name, ' ', employees.last_name) AS employee_name,
                roles.title AS job_title,
                roles.salary AS salary,
                departments.name AS department_name,
                CONCAT (man.first_name, ' ', man.last_name) AS manager
                
                FROM employees

                INNER JOIN roles 
                ON employees.role_id = roles.id

                INNER JOIN departments 
                ON roles.department_id = departments.id

                LEFT JOIN employees man
                ON employees.manager_id = man.id;
                `);

                console.table(employeePrint[0]);

                start();
            
                break;

            case 'Add a department':

                addDepartment();

                break;

            case 'Add a role':

                break;

            case 'Add an employee':

                break;

            case 'Update employee role':

                break;

            case 'Quit':
                
                process.exit(1);
        }
    });
}

function addDepartment() {

    Inquirer.prompt( [
        {
            name: 'deptName',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ]).then( (response) => {
        Query.addDepartment(response.deptName);
        start();
    })
}

module.exports = {
    start: start
};