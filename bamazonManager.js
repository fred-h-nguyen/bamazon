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

            case 'Add New Product': addProduct();

                break;

            case 'Exit': connection.end();
                break;
        }
    })
}

//list products
function viewProducts() {
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products', function (err,data) {
        if (err) throw (err)
        console.table(data)
        managerPrompt()
    })
}

// which item has less than 5 quantity in stock
function stockUnder5() {
    connection.query('SELECT item_id, product_name FROM products WHERE stock_quantity < 5', function (err,data) {
        if (err) throw (err)
        console.table(data)
        managerPrompt();
    })
}

//add to stock

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

//add product

function addProduct(){
    inquirer.prompt([{
        type:'input',
        name:'product',
        message:'Product Name:'
    },{
        type:'input',
        name:'department',
        message:'Department Name:'
    },{
        type: 'number',
        name: 'price',
        message: 'Price of product:'
    },{
        type: 'number',
        name: 'quantity',
        message: 'Initial Stock Quantity:'
    }]).then(function(res){
        var product = res.product;
        var department = res.department;
        var price = res.price;
        var stock = res.quantity;
        connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity VALUE (?,?,?,?))',[product,department,price,stock],function(err){
            if(err) throw (err);
            console.log(`Added ${product} to inventory`);
            managerPrompt();
        })
    })
}

//start connection and run the prompt
connection.connect(function(err){
    if (err) throw (err);
    managerPrompt();
})