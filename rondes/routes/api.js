var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    function display_error(errP, connection) {
        console.log('Error during processing: \n\t', errP);
        res.render('api', {
            title: 'SigFox Callback API Error',
            id: idP,
            data: dataP,
            time: timeP.toLocaleDateString() + ' ('+recievedTime+')',
            error: errP
        });
        if (typeof connection !== 'undefined' && connection) {
            connection.end();
        }
    }

    var idP = req.query.id;
    var dataP = req.query.data;
    var timeP = new Date(0); // The 0 there is the key, which sets the date to the epoch
    timeP.setUTCSeconds(req.query.time);
    timeP.setHours(0, 0, 0, 0);

    var recievedTime = req.query.time;

    req.query.time;
    var err = null;

    console.log("Got ", {
        id: idP,
        data: dataP,
        time: timeP
    })

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
            if (err) display_error(err, connection);
            else {
                if (!rows || rows.length == 0) {
                    display_error("No garde with for tag id : " + dataP);
                } else {
                    console.log('Got Garde: ', rows[0].id_garde);
                    var garde_id = rows[0].id_garde;

                    // Vérifier que l'id du PDC existe.
                    connection.query('SELECT pdc.id_pdc, pdc.id_ronde FROM pointDeControle pdc WHERE pdc.id_pdc = ?', [idP], function(err, rows, fields) {
                        if (err) display_error(err, connection);
                        else {
                            if (!rows || rows.length == 0) {
                                display_error("No PDC with for id : " + idP);
                            } else {
                                console.log('Got PDC: ', rows[0].id_pdc);
                                var pdc_id = rows[0].id_pdc;
                                var ronde_id = rows[0].id_ronde;

                                // Récupérer l'instance de ronde concernée par le pdc pour la date données
                                connection.query('SELECT rxd.id_ronde_x_date FROM rondeXDate rxd INNER JOIN ronde r ON r.id_ronde = rxd.id_ronde WHERE rxd.id_ronde = ? AND rxd.date_ronde = ? AND r.id_garde = ?', [ronde_id, timeP, garde_id], function(err, rows, fields) {
                                    if (err) display_error(err, connection);
                                    else {
                                        if (!rows || rows.length == 0) {
                                            display_error("No ronde with for id : " + ronde_id + " and time " + timeP.toLocaleDateString());
                                        } else {
                                            console.log('Got ronde instance with id : ', rows[0].id_ronde_x_date);
                                            var ronde_inst_id = rows[0].id_ronde_x_date;

                                            connection.query('INSERT INTO badgeage(id_garde, id_pdc, id_ronde_x_date, date_badgeage) VALUES(?, ?, ?, ?)', [garde_id, pdc_id, ronde_inst_id, timeP], function(err, rows, fields) {
                                                if (err) {
                                                  if (err.code && err.code == 'ER_DUP_ENTRY') {
                                                    display_error("This Badgeage already exists.", connection);
                                                  } else {
                                                    display_error(err, connection);
                                                  }
                                                } else {
                                                    res.render('api', {
                                                        title: 'SigFox Callback API',
                                                        id: idP,
                                                        data: dataP,
                                                        time: timeP.toLocaleDateString(),
                                                        error: null
                                                    });
                                                    connection.end();
                                                    // Check update OK
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });



    } else {
        display_error("Invalid parameters")
    }

});

module.exports = router;
