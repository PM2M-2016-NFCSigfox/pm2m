var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    var date = req.body.date;
    var ronde = req.body.ronde;

    if (!date || !ronde) {
        res.send('Not enough parameters: '+JSON.stringify({ date : date, ronde : ronde}));
    } else {

        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.db
        });

        connection.connect();

        function display_error(err) {
            callback(err);
        }

        function callback(status) {
            connection.end();
            res.send(status);
        }
        console.log('je passe la');
        connection.query('INSERT INTO rondeXDate(id_ronde, date_ronde) values (?, ?)', [ronde, date], function(err, rows, fields) {
            console.log(err);
            if (err) {
                display_error(err);
            } else {
                callback("OK");
            }
        });
    }
});

module.exports = router;
