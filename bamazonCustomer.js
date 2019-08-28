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

//functions==============================================

//show id, name, prices

function showItems() {
    connection.query('SELECT item_id,product_name,price FROM products', function (err, data) {
        if (err) throw (err);
        console.table(data)
        prompt();
    })
}

//prompt ask customer what id then ask how much of item they want
function prompt() {
    inquirer.prompt([{
        type: 'number',
        name: 'id',
        message: 'What item id are you purchasing?'
    }, {
        type: 'number',
        name: 'quantity',
        message: 'How much of the item are you purchasing?'
    }]).then(function (res) {
        var id = res.id;
        var quantity = res.quantity;

        connection.query('SELECT stock_quantity FROM products WHERE item_id = ?', [id], function (err, data) {
            if (err) throw (err);
            var stock = data[0].stock_quantity
            if (quantity < stock) {
                buyItems(id, quantity);
                //run buy function
            } else {
                console.log('Insufficient Quantity!')
                //continue shopping prompt   
                continuePrompt();
            }
        })
    })
}

function updateProductSale(id, totalSale) {
    connection.query('UPDATE products SET product_sales = product_sales + ? WHERE item_id = ?', [totalSale, id], function (err) {
        if (err) throw (err)
        console.log('Updated stock')

        continuePrompt()
    })
}

function buyItems(id, quantity) {

    connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?;', [quantity, id], function (err) {
        if (err) throw (err);
    })
    
    connection.query('SELECT price FROM products WHERE item_id = ?', [id], function (err, data) {
        if (err) throw (err);
        var price = data[0].price;
        var totalSale = price * quantity;;
        console.log(price);
        console.log(totalSale);
        updateProductSale(id, totalSale);
    })


}

function continuePrompt() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to continue shopping?'
    }]).then(function (res) {
        if (res.continue) {
            showItems();
        } else {
            console.log('Thanks for shopping at Bamazon!')
            connection.end();
        }
    })
}

connection.connect(function (err) {
    if (err) throw (err)

    showItems()
})

