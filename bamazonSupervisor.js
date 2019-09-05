//required ==============================================
var inquirer = require('inquirer');
var Table = require('cli-table');
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
    var query = `SELECT departments.department_id,departments.department_name,over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales)-departments.over_head_costs) AS total_profits FROM departments `
    query += `LEFT JOIN products ON departments.department_name = products.department_name `;
    query += `GROUP BY department_name `;
    query+= `ORDER BY department_id`

    connection.query(query, function (err,data) {
        if (err) throw (err)
        //console.log(data)
        var table = new Table({ head: ['department_id', 'department_name', 'over_head_costs', 'product_sales','total_profits'] })

        data.forEach(function (department) {
            table.push([department.department_id, department.department_name, department.over_head_costs, department.product_sales, department.total_profits])
        })
        console.log(table.toString())
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
