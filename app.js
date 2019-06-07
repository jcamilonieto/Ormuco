/*
CREATE TABLE `forms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `animal` varchar(45) NOT NULL,
  `color` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    user: "username",
    password: "password",
    database: "schema",
    host: "localhost",
});

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/app.html'));
    connection.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
});

app.post('/formPost', function(request, response) {
	var color = request.body.color;
	var animal = request.body.animal;
	var name = request.body.name;
	if (name && color && animal) {
		connection.query('SELECT * FROM `forms` WHERE name = ?', [name], function(error, results, fields) {
			if (results.length > 0) {
                console.log(results);
				response.send('Name already exists!');
                response.end();
			} else {
                connection.query(
                    "INSERT INTO `forms` (name, animal, color) VALUES ('" 
                    + name + "', '" + animal + "', '" + color + "')"
                    ,function(error, results, fields) {
                        console.log(results);  
                        response.send('Ok!');
                        response.end();
                });
			}
		});
	} else {
		response.send('Please fill out form!');
		response.end();
	}
});
app.listen(3000);