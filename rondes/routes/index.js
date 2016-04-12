var express = require('express');
var config = require('../conf.json');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
    function display_error(errP) {
        console.log('Error during processing: \n\t', errP);
        res.render('index', {
            title: 'Rondes state Error',
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
    var plannedRondes = [];
    var rondes = [];
    var infoRondes = {};

    connection.query('SELECT * FROM ronde', [], function (err, rondesQ, fields) {
        rondesQ.forEach(function (rondeQ) {
            infoRondes[rondeQ.id_ronde] = rondeQ;
            connection.query('SELECT nom FROM garde WHERE id_garde = ?', [rondeQ.id_garde], function (err, nomGarde, fileds) {
                if (!err) {
                    rondes.push({
                        id_ronde: rondeQ.id_ronde,
                        nom_ronde: rondeQ.nom_ronde,
                        nom_garde: nomGarde[0].nom
                    });
                    if (rondes.length == rondesQ.length) {
                        getRondeXdate();
                    }
                } else {
                    display_error(err);
                }
            });
        });
    });

    function callback(plannedRondes, rondes) {
        res.render('index', {
            title: 'Gestion des rondes',
            plannedRondes: plannedRondes,
            rondes: rondes
        });
        connection.end();
    }

    function getRondeXdate() {
        connection.query('SELECT * FROM rondeXDate ORDER BY date_ronde ASC', [], function (err, rondesXDate, fields) {
            if (!err) {
                rondesXDate.forEach(function (ronde) {
                    connection.query('SELECT count(id_pdc) as nb_pdc FROM pointDeControle WHERE id_ronde = ?', [ronde.id_ronde], function (err, nb_pdc, fields) {
                        if (!err) {
                            connection.query('SELECT count(id_pdc) as nb_badgeage FROM badgeage WHERE date_badgeage = ?', [ronde.date_ronde], function (err, rows, fields) {
                                if (!err) {
                                    var state = "";
                                    if (nb_pdc[0].nb_pdc == rows[0].nb_badgeage) {
                                        state = "OK";
                                    } else if (rows.nb_badgeage > 0) {
                                        state = "WIP";
                                    } else if (ronde.date_ronde < new Date()) {
                                        state = "KO";
                                    } else {
                                        state = "TODO";
                                    }
                                    plannedRondes.push({
                                        id_ronde_x_date: ronde.id_ronde_x_date,
                                        nom_ronde: infoRondes[ronde.id_ronde].nom_ronde,
                                        date_ronde: ronde.date_ronde != null? moment(ronde.date_ronde).locale("fr").format("dddd DD MMMM YYYY") : "",//ronde.date_ronde.toDateString(),
                                        state: state
                                    });
                                } else {
                                    display_error(err);
                                }
                                if (plannedRondes.length == rondesXDate.length) {
                                    callback(plannedRondes, rondes);
                                }
                            });
                        } else {
                            display_error(err);
                        }
                    });
                });
            } else {
                display_error(err);
            }
        });
    }
});

module.exports = router;
