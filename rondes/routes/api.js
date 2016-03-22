var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    function display_error(errP) {
        console.log('Error during processing: \n\t', errP);
        res.render('api', {
            title: 'SigFox Callback API Error',
            id: idP,
            data: dataP,
            time: timeP,
            error: errP
        });
    }

    var idP = req.query.id;
    var dataP = req.query.data;
    var timeP = req.query.time;
    var err = null;

    if (idP && dataP && timeP) {


        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.db
        });

        connection.connect();
        // Vérifier que l'id_tag est affecté à un garde
        connection.query('SELECT g.id_garde FROM garde g WHERE g.id_tag = ?', [dataP], function(err, rows, fields) {
            if (!err) {
                if (!rows || rows.length == 0) {
                    display_error("No garde with for tag id : " + dataP);
                } else {
                    console.log('Got Garde: ', rows[0].id_garde);
                    var garde_id = rows[0].id_garde;

                    // Vérifier que l'id du PDC existe.
                    connection.query('SELECT pdc.id_pdc, pdc.id_ronde FROM pointDeControle pdc WHERE p.id_pdc = ?', [idP], function(err, rows, fields) {
                        if (!err) {
                            if (!rows || rows.length == 0) {
                                display_error("No PDC with for id : " + idP);
                            } else {
                                console.log('Got PDC: ', rows[0].id_pdc);
                                var pdc_id = rows[0].id_pdc;
                                var ronde_id = rows[0].id_ronde;

                                // Récupérer l'instance de ronde concernée par le pdc pour la date données
                                connection.query('SELECT rxd.id_ronde_x_date FROM rondeXDate rxd WHERE rxd.id_ronde = ?', [ronde_id], function(err, rows, fields) {
                                    if (!err) {
                                        if (!rows || rows.length == 0) {
                                            display_error("No ronde with for id : " + ronde_id);
                                        } else {
                                            console.log('Got Garde: ', rows[0].id_pdc);
                                            var ronde_inst_id = rows[0].id_ronde_x_date;

                                            connection.query('INSERT INTO badgeage(id_gardien, id_pdc, id_ronde_x_date, date_badgeage) VALUES(?, ?, ?, ?)', [garde_id, pdc_id, ronde_inst_id, timeP], function(err, rows, fields) {
                                                if (!err) {
                                                    res.render('api', {
                                                        title: 'SigFox Callback API',
                                                        id: idP,
                                                        data: dataP,
                                                        time: timeP,
                                                        error: null
                                                    });
                                                } else {
                                                    display_error(err);
                                                }
                                                // Check update OK
                                            });
                                        }
                                    } else {
                                        display_error(err);
                                    }
                                });
                            }
                        } else {
                            display_error(err);
                        }
                    });
                }


            } else {
                display_error(err);

            }
        });

        connection.end();

    }

});

module.exports = router;
