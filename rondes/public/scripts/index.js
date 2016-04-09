$(document).ready(function () {
    // Lorsque je soumets le formulaire
    $('#addRonde').on('submit', function (e) {
        e.preventDefault(); //J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire

        var $this = $(this); // L'objet jQuery du formulaire

        // Je récupère les valeurs
        var date = $this.find('input[name="date"]').val();
        var idRonde = $this.find('input[name="ronde"]').val();

        console.log(date, idRonde);

        if (!date || !idRonde) {
            $this.validate({ // initialize the plugin
                rules: {
                    date: {
                        required: true
                    },
                    idRonde: {
                        required: true
                    }
                }
            });
        } else {
            // Envoi de la requête HTTP en mode asynchrone
            console.log($this.attr('action'));
            $.ajax({
                url: '/planRonde', // Le nom du fichier indiqué dans le formulaire
                type: 'POST', // La méthode indiquée dans le formulaire (get ou post)
                data: {date: date, ronde: idRonde}, // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
                success: function (html) { // Je récupère la réponse
                    if (html === 'OK') {
                        $('#addRonde').modal('hide');
                        location.reload();
                    } else {
                        alert(html);
                    }
                }
            });
        }
    });
    $('#removePlannedRonde').on('show.bs.modal', function (e) {
        var ronde_id = e.relatedTarget.dataset.id;
        var ronde_date = e.relatedTarget.dataset.date;
        var modal = $(this);
        modal.find('.modal-header').find('h3').html('Supprimer la ronde du <strong>' + ronde_date + "</strong>?");

        $('.delete').on('click', function (e) {
            $.ajax({
                url: '/removePlannedRonde', // Le nom du fichier indiqué dans le formulaire
                type: 'POST', // La méthode indiquée dans le formulaire (get ou post)
                data: {idronde: ronde_id}, // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
                success: function (html) { // Je récupère la réponse
                    if (html === 'OK') {
                        modal.modal('hide');
                        location.reload();
                    } else {
                        alert(JSON.stringify(html));
                    }
                }
            });
        });

    });
});

jQuery.fn.shake = function (intShakes, intDistance, intDuration) {
    this.each(function () {
        $(this).css("position", "relative");
        for (var x = 1; x <= intShakes; x++) {
            $(this).animate({left: (intDistance * -1)}, (((intDuration / intShakes) / 4)))
                .animate({left: intDistance}, ((intDuration / intShakes) / 2))
                .animate({left: 0}, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
};
