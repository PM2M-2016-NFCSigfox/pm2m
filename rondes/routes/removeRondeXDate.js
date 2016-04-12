var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    var id_ronde = req.body.idronde;

    if (!id_ronde) {
        res.send('Not enough valid parameters: '+JSON.stringify({ idronde : id_ronde}));
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

        connection.query('DELETE FROM rondeXDate WHERE id_ronde_x_date = ?', [id_ronde], function(err, rows, fields) {
            if (err) {
                display_error(err);
            } else {
                callback("OK");
            }
        });
    }
});

module.exports = router;
