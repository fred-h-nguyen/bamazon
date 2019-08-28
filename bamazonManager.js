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
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
    }]).then(function (res) {

        var action = res.action

        switch (action) {
            case 'View Products for Sale': viewProducts();

                break;

            case 'View Low Inventory': stockUnder5();

                break;

            case 'Add to Inventory': addInventory();

                break;

            case 'Add New Product':

                break;

            case 'Exit': connection.end();
                break;
        }
    })
}

function viewProducts() {
    connection.query('SELECT item_id, product_name, prices, stock_quantity FROM products', function (err) {
        if (err) throw (err)
        managerPrompt()
    })
}

function stockUnder5() {
    connection.query('SELECT item_id, product_name FROM products WHERE stock_quantity < 5', function (err) {
        if (err) throw (err)
        managerPrompt();
    })
}

function addInventory() {
    inquirer.prompt([{
        type: 'number',
        name: 'id',
        message: 'What item_id are you adding stock to?'
    }, {
        type: 'number',
        name: 'quantity',
        message: 'How much stock are you adding?'
    }]).then(function (res) {
        var item_id = res.id;
        var quantity = res.quantity;
        connection.query('UPDATE products SET stock_quantity= stock_quantity + ? WHERE item_id = ?', [quantity, item_id], function (err) {
            if (err) throw (err);
            console.log(`You have addded ${quantity} to item_id: ${item_id}`);
            managerPrompt();
        })
    })
}

function addProduct(){
    inquirer.prompt([{}])
}