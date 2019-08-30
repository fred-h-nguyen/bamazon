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

function viewProfits() {
    var query = `SELECT departments.department_id,departments.department_name,over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales)-departments.over_head_costs) AS total_profit FROM departments `
    query += `LEFT JOIN products ON departments.department_name = products.department_name `;
    query += `GROUP BY department_id;`;

    connection.query(query, function (err,data) {
        if (err) throw (err)
        console.table(data);
        prompt();
    })
}

function newDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What department are you adding?'
    }, {
        type: 'input',
        name: 'cost',
        message: `What is the department's over_head_costs?`
    }]).then(function (res) {
        var name = res.department;
        var cost = res.cost;
        connection.query('INSERT INTO departments (department_name, over_head_costs) VALUE (?,?);', [name, cost], function (err) {
            if (err) throw (err)
            prompt();
        })
    })
}

function prompt() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Actions:',
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
    }]).then(function (res) {
        var action = res.action;

        switch (action) {
            case 'View Product Sales by Department': viewProfits();

                break;

            case 'Create New Department': newDepartment();

                break;

            case 'Exit': connection.end();
                break;

        }
    })
}
// RUN THE FUNCTIONS INSIDE CONNECTION.CONNECT==================================

connection.connect(function(err){
    if (err) throw (err);

    prompt();
})
