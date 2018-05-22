var inquirer = require("inquirer");
var prompt = require("prompt");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});
connection.connect(function (err) {
    if (err) throw err;
    userView();
});

function listItems(res) {
    connection.query("SELECT * FROM products", res, function (err, things) {
        if (err) {
            throw err;
        }
        for (var i = 0; i < things.length; i++) {

            console.log(`\nID: ${things[i].item_id} - ${things[i].product_name} - $${things[i].price}`);
        }
    })
}
function userView() {
    listItems();
    // function to ask user for item ID
    inquirer.prompt([
        {
            name: "item_id",
            message: "Please enter a Product ID",
            type: "input"
        }
    ]).then(function (response) {
        // once item ID is entered it will select that item
        connection.query("SELECT * FROM products WHERE ?", response, function (err, data) {
            if (err) {
                throw err;
            }
            // then ask the quantity the user would like to purchase
            inquirer.prompt([
                {
                    name: "numberOfItems",
                    message:
                        ` You have selected:\n Product: ${data[0].product_name}\n Department: ${data[0].department_name}\n Price: $${data[0].price}\n Left in Stock: ${data[0].quantity}\n Please enter the quantity you would like to purchase`,
                    type: "input"
                }
            ]).then(function (quantityRequested) {
                // if user selects a larger quantity that available display "Insufficient quantity!"
                if (quantityRequested.numberOfItems > data[0].quantity) {
                    console.log("Insufficient quantity!");
                    connection.end();
                } else {
                    // if quantity is less than current quantity update the mySQL database to reflect this
                    connection.query(`UPDATE products SET quantity = quantity - ${quantityRequested.numberOfItems} WHERE item_id = ${data[0].item_id}`, function (err, stuff) {
                        if (err) {
                            throw err;
                        }
                        var updatedQuantity = data[0].quantity - quantityRequested.numberOfItems;
                        console.log(`Updated Inventory: ${updatedQuantity}`);
                        // once database update completes show customer total cost of their purchase
                        var totalPurchase = data[0].price * quantityRequested.numberOfItems;
                        console.log(`Your purchase total is: $${totalPurchase}`);
                    })

                    connection.end();
                }
            });
        })
    });
};

