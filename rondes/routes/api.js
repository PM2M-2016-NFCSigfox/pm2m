var express = require('express');
var config = require('../conf.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var idP = req.query.id;
	var dataP = req.query.data;
	var timeP = req.query.time;
	
	res.render('api', { title: 'SigFox Callback API', id: idP, data: dataP, time: timeP });
	
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : config.host,
	  user     : config.user,
	  password : config.password,
	  database : config.db
	});

	connection.connect();
	
	var err = false;
	// Vérifier que l'id_tag est affecté à un garde
	connection.query('SELECT g.id FROM garde g WHERE g.id_tag = ?', [dataP], function(err, rows, fields) {
	  if (!err) {
		console.log('Got Garde: ', rows[0].id);
		var garde_id = rows[0].id;
		
		// Vérifier que l'id du PDC existe.
		connection.query('SELECT pdc.id_pdc, pdc.id_ronde FROM pointDeControle pdc WHERE p.id_pdc = ?', [idP], function(err, rows, fields) {
			if (!err) {
				console.log('Got PDC: ', rows[0].id_pdc);
				var pdc_id = rows[0].id_pdc;
				var ronde_id = rows[0].id_ronde;
				
				// Récupérer l'instance de ronde concernée par le pdc pour la date données
				connection.query('SELECT rxd.id_ronde_x_date FROM rondeXDate rxd WHERE rxd.id_ronde = ?', [ronde_id], function(err, rows, fields) {
					if (!err) {
						console.log('Got Garde: ', rows[0].id_pdc);
						var ronde_inst_id = rows[0].id_ronde_x_date;
						
						connection.query('INSERT INTO badgeage(id_gardien, id_pdc, id_ronde_x_date, date_badgeage) VALUES(?, ?, ?, ?)', [garde_id, pdc_id, ronde_inst_id, timeP], function(err, rows, fields) {
							if (!err) {
								console.log('Got Garde: ', rows[0].id_pdc);
								var pdc_id = rows[0].id_pdc;
							} 
						});
					} 
				});
				
			} 
		});
		
		
	  } 
	  
	  if (err) {
		console.log('Error while performing Query.\n', err);
	  }
	});

	connection.end();
	
  
});

module.exports = router;
