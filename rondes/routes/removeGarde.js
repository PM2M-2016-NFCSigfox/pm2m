var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    var id_garde = req.body.idgarde;
    console.log(id_garde);
    if (id_garde == null || Number.isNaN(id_garde)) {
        res.send('Not enough valid parameters: '+JSON.stringify({ idgarde : id_garde}));
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
            console.log(err);
            callback(err);
        }

        function callback(status) {
            connection.end();
            res.send(status);
        }

        connection.query('DELETE FROM garde WHERE id_garde = ?', [id_garde], function(err, rows, fields) {
            if (err) {
                display_error(err);
            } else {
                callback("OK");
            }
        });
    }
});

module.exports = router;
