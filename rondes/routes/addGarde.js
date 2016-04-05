var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    var nom_garde = req.body.nom;
    var nfc_garde = req.body.nfc;

    if (nom_garde == null || nfc_garde == null) {
        res.send('Not enough parameters: '+JSON.stringify({ nom : nom_garde, nfc : nfc_garde}));
    } else if (!/^[a-fA-F0-9]+$/.test(nfc_garde)) {
        res.send('NFC given ID is not in HEX: '+JSON.stringify({ nom : nom_garde, nfc : nfc_garde}));
    } else {

        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.db
        });

        var gardesArray = []
        connection.connect();

        function display_error(err) {
            callback(err);
        }

        function callback(status) {
            connection.end();
            res.send(status);
        }

        connection.query('INSERT INTO garde(nom, id_tag) values (?, ?)', [nom_garde, nfc_garde], function(err, rows, fields) {
            if (err) {
                display_error(err);
            } else {
                callback("OK");
            }
        });
    }
});

module.exports = router;
