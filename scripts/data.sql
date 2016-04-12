insert into garde (id_garde, nom, id_tag) values (1, 'Didier', '04f05a59127a00'),
(2, 'John', 'eb4af31b'), (3, 'Marie', '043365ba342380'), (4, 'Lee', '04364fba342380');

insert into ronde (id_ronde, nom_ronde, id_garde) values (1, 'Salle des machines', 1),
(2, 'Couloirs du 1er étage', 1),
(3, 'Hall 1', 2),
(4, 'Hall 2', 1),
(5, 'Accueil', 2),
(6, 'Toit', 3),
(7, 'Placard à balais', 4);

insert into pointDeControle (id_pdc, label_pdc, num_piece, id_ronde) values ('1C178', 'Sigfox', 'Piece 1', 1);

insert into rondeXDate (id_ronde_x_date, id_ronde, date_ronde) values (1, 1, '2016-3-22'),
(2, 1, '2016-3-29'),
(3, 1, '2016-4-5'),
(4, 1, '2016-4-12'),
(5, 1, '2016-4-19');

insert into badgeage (id_garde, id_pdc, id_ronde_x_date, date_badgeage) values (1, '1C178',1, '2016-3-22');
