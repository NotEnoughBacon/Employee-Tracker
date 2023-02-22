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
                'Delete employee',
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

                addRole();

                break;

            case 'Add an employee':

                addEmployee();

                break;

            case 'Update employee role':

                updateEmployee();

                break;

            case 'Delete employee':

                deleteEmployee();

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
        console.log('Department added sucessfully!')
        start();
    })
};

async function addRole() {

    let depts = await Query.toArray(`SELECT * FROM departments`, 'name');

    Inquirer.prompt( [
        {
            name: 'roleName',
            type: 'input',
            message: 'What is the name of the new role?'
        },
        {
            name: 'roleSal',
            type: 'number',
            message: 'What is the salary of the new role?'
        },
        {
            name: 'roleDept',
            type: 'list',
            message: 'What department is this role under?',
            choices: depts
        }
    ]).then ( async (response) => {

        let dept = await Query.toArray(`SELECT (id) FROM departments WHERE name = '${response.roleDept}'`, 'id');

        if (!response.roleSal.isNaN) {

            Query.addRole(response.roleName, response.roleSal, dept[0]);

            console.log('Role added sucessfully!')
        }

        start();
    });
}

async function addEmployee() {

    let employees = await Query.toArray(`SELECT CONCAT (first_name, ' ', last_name) AS name FROM employees`, 'name');
    employees.push('None');

    let roles = await Query.toArray(`SELECT * FROM roles`, 'title');

    Inquirer.prompt ( [

        {
            name: 'firstName',
            type: 'input',
            message: 'What is the employees first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the employees last name?'
        },
        {
            name: 'roleName',
            type: 'list',
            message: `What is the employee's role?`,
            choices: roles
        },
        {
            name: 'manager',
            type: 'list',
            message: `Who is the employee's manager?`,
            choices: employees
        }
    ]).then ( async (response) => {

        let roleId = await Query.toArray(`SELECT (id) FROM roles WHERE title = '${response.roleName}'`, 'id');

        let managerId = await Query.toArray(`SELECT (id) FROM employees WHERE CONCAT (first_name, ' ',last_name) = '${response.manager}'`, 'id');

        Query.addEmployee(response.firstName, response.lastName, roleId[0], managerId[0]);

        console.log('Employee added sucessfully!')

        start();
    });
}

async function updateEmployee() {

    let employees = await Query.toArray(`SELECT CONCAT (first_name, ' ', last_name) AS name FROM employees`, 'name');

    let roles = await Query.toArray(`SELECT * FROM roles`, 'title');

    let managers = employees;
    managers.push('none');

    Inquirer.prompt( [

        {
            name: 'employee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: employees
        },
        {
            name: 'updateRole',
            type: 'list',
            message: `What is the employee's new role?`,
            choices: roles
        },
        {
            name: 'changeManager',
            type: 'confirm',
            message: 'Will the employee have a new manager?'
        },
        {
            name: 'newManger',
            type: 'list',
            message: `Who will be the employee's new manager?`,
            choices: managers,
            when: (res) => res.changeManager === true
        }
    ]).then ( async (response) => {

        let roleId = await Query.toArray(`SELECT (id) FROM roles WHERE title = '${response.updateRole}'`, 'id');

        let managerId = await Query.toArray(`SELECT (id) FROM employees WHERE CONCAT (first_name, ' ', last_name) = '${response.newManger}'`, 'id');

        if (managerId.length === 0) managerId = null;

        Query.caseQuery(`
        UPDATE employees
        SET role_id = ${roleId[0]}
        ${response.changeManager ? ', manager_id = ' + managerId : ''}
        WHERE CONCAT (first_name, ' ', last_name) = '${response.employee}'
        `);

        console.log('Employee updated sucessfully!')

        start();
    });
}

async function deleteEmployee() {

    let employees = await Query.toArray(`SELECT CONCAT (first_name, ' ', last_name) AS name FROM employees`, 'name');
    
    Inquirer.prompt( [ 

        {
            name: 'employee',
            type: 'list',
            message: 'Which employee would you like to delete?',
            choices: [...employees, 'Quit']
        },
        {
            name: 'confirm',
            type: 'confirm',
            message: (response) => {
                if (response.employee === 'Quit') {
                    start();
                } else {
                `Are you sure you want to delete '${response.employee}'?`}}
        }
    ]).then (async (response) => {

        if (response.confirm === false) {
            start();
        } else {

            let employeeId = await Query.toArray(`SELECT (id) FROM employees WHERE CONCAT (first_name, ' ', last_name) = '${response.employee}'`, 'id')

            Query.caseQuery(`
            DELETE FROM employees WHERE id = '${employeeId[0]}'
            `)
        }

        console.log('Employee deleted sucessfully!')

        start();
    })
}

module.exports = {
    start: start
};