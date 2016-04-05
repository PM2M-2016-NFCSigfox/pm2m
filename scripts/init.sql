drop schema rondes;
create schema rondes;
use rondes;

create table garde(
id_garde INT(8) UNSIGNED AUTO_INCREMENT, 
nom VARCHAR(64) NOT NULL, 
id_tag VARCHAR(16) UNIQUE NOT NULL,
PRIMARY KEY (id_garde)
);

create table ronde(
id_ronde INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nom_ronde VARCHAR(50) NOT NULL,
id_garde INT(8) UNSIGNED,
FOREIGN KEY (id_garde) REFERENCES garde(id_garde)
);

create table pointDeControle(
id_pdc VARCHAR(32) PRIMARY KEY,
label_pdc VARCHAR(64) NOT NULL,
num_piece VARCHAR(64) NOT NULL,
id_ronde INT(8) UNSIGNED,
FOREIGN KEY (id_ronde) REFERENCES ronde(id_ronde)
); 

create table rondeXDate(
id_ronde_x_date INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
id_ronde INT(8) UNSIGNED NOT NULL,
date_ronde DATETIME,
FOREIGN KEY (id_ronde) REFERENCES ronde(id_ronde)
);

create table badgeage(
id_garde INT(8) UNSIGNED NOT NULL,
id_pdc VARCHAR(32) NOT NULL,
id_ronde_x_date INT(8) UNSIGNED NOT NULL,
date_badgeage DATETIME,
PRIMARY KEY (id_garde, id_pdc, id_ronde_x_date, date_badgeage),
FOREIGN KEY (id_garde) REFERENCES garde(id_garde),
FOREIGN KEY (id_pdc) REFERENCES pointDeControle(id_pdc),
FOREIGN KEY (id_ronde_x_date) REFERENCES rondeXDate(id_ronde_x_date)
);
