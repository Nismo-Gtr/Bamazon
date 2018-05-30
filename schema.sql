CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45),
    department_name VARCHAR(45),
    price FLOAT(4),
    quantity INT(3),
    PRIMARY KEY (id)
);