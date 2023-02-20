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
            ],
            default: 0
        }
    ]).then(async (answer) => {

        switch (answer.mainMenu) {

            case 'View all departments':

                let printDept = await Query.caseQuery(`SELECT * FROM departments`);

                console.log(printDept);

                break;

            case 'View all roles':

            case 'View all employees':

            case 'Add a department':
            
            case 'Add a role':

            case 'Add an employee':

            case 'Update employee role':

            case 'Quit':

                process.exit(1);
        }
    });
}

module.exports = {
    start: start
};