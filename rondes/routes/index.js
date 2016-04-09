var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    function display_error(errP) {
        console.log('Error during processing: \n\t', errP);
        res.render('index', {
            title: 'Rondes state Error',
            id: idP,
            data: dataP,
            time: timeP,
            error: errP
        });
    }

    var idP = req.query.id;
    var timeP = req.query.time;
    var err = null;

    var mysql = require('mysql');

    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db
    });

    connection.connect();
    var result = [];
    connection.query('SELECT * FROM rondeXDate', [], function (err, rondesXDate, fields) {
        if (!err) {
            rondesXDate.forEach(function (ronde) {
                connection.query('SELECT count(id_pdc) as nb_pdc FROM pointDeControle WHERE id_ronde = ?', [ronde.id_ronde], function (err, nb_pdc, fields) {
                    if (!err) {
                        connection.query('SELECT count(id_pdc) as nb_badgeage FROM badgeage WHERE date_badgeage = ?', [ronde.date_ronde], function (err, rows, fields) {
                            if(!err) {
                                var state = "";
                                if (nb_pdc[0].nb_pdc == rows[0].nb_badgeage) {
                                    state = "OK";
                                } else if (rows.nb_badgeage > 0) {
                                    state = "WIP";
                                } else {
                                    state = "TODO";
                                }
                                result.push({
                                    id_ronde_x_date: ronde.id_ronde_x_date,
                                    id_ronde: ronde.id_ronde,
                                    date_ronde: ronde.date_ronde.toDateString(),
                                    state: state
                                });
                            }else{
                                display_error(err);
                            }
                            if(result.length==rondesXDate.length){
                                callback(result);
                            }
                        });
                    }else{
                        display_error(err);
                    }
                });
            });
        } else {
            display_error(err);
        }
    });

    function callback(result){
        res.render('index', {
            title: 'Gestion des rondes',
            data: result
        });
        connection.end();
    }
});

module.exports = router;
