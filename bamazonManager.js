//required ==============================================
var inquirer = require('inquirer');
//mysql
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon_db'
})


//functions

function managerPrompt() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function (res) {

        var action = res.action

        switch (action) {
            case 'View Products for Sale':

                break;

            case 'View Low Inventory':

                break;

            case 'Add to Inventory':

                break;

            case 'Add New Product':

                break;
        }





    })
}