var express = require('express');
var async = require('async');
var config = require('../conf.json');
var moment = require('moment');
var qr = require('qr-image');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

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
        console.log('Error during processing: \n\t', err);
        connection.end();
    }

    function callback(gardesArray) {
      connection.end();
      res.render('gardes', {
          title: 'Gestion des gardiens',
          gardes: gardesArray
      });
    }


    // Vérifier que l'id_tag est affecté à un garde
    connection.query('SELECT g.*, b.date_badgeage FROM garde g LEFT JOIN badgeage b ON g.id_garde = b.id_garde WHERE b.date_badgeage = (SELECT max(bb.date_badgeage) FROM badgeage bb WHERE bb.id_garde = b.id_garde) OR b.date_badgeage IS NULL ORDER BY g.nom ASC', [], function(err, rows, fields) {
        if (err) display_error(err);
        else {
            rows.forEach(function(garde) {
                connection.query('SELECT r.nom_ronde FROM ronde r WHERE r.id_garde = ?', [garde.id_garde], function(emp_err, emp_rows, emp_fields) {
                    if (emp_err) {
                      console.log('article each callback '+emp_err);
                    } else {
                        var rondesDuGarde = []
                        emp_rows.forEach(function (ronde) {
                            rondesDuGarde.push(ronde.nom_ronde);
                        });

                        var gardeJson = {
                            id: garde.id_garde,
                            nom: garde.nom,
                            nfc: garde.id_tag,
                            nfcQr : qr.imageSync(garde.id_tag, { type: 'png' }).toString('base64'),
                            rondes: rondesDuGarde,
                            dernierBadgeage: garde.date_badgeage != null? moment(garde.date_badgeage).locale("fr").format("dddd DD MMMM YYYY") : ""
                        }

                        gardesArray.push(gardeJson);
                        if (gardesArray.length == rows.length) {
                            callback(gardesArray);
                        }
                    }

                });


            });

        }
    });


});

module.exports = router;
