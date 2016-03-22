insert into garde (id_garde, nom, id_tag) values (1, 'Didier', '4F05A59127A0'),
(2, 'John', 'EB4AF3MB');

insert into ronde (id_ronde, id_garde) values (1, 1),
(2, 1),
(3, 2),
(4, 1),
(5, 2);

insert into pointDeControle (id_pdc, label_pdc, num_piece, id_ronde) values ('1C178', 'Sigfox', 'Piece 1', 1);

insert into rondeXDate (id_ronde_x_date, id_ronde, date_ronde) values (1, 1, '2016-3-22'),
(2, 1, '2016-3-29'),
(3, 1, '2016-4-5'),
(4, 1, '2016-4-12'),
(5, 1, '2016-4-19');
