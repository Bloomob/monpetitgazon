"use strict";

var $page = $('.page');

function getEffectifs() {
    $.get({
        url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/teams",
        headers: { "Authorization": Cookies.get('token') }
    }).done(function (data){
        var clubs = data.teamsid,
            effectifs = data.teams,
            i,
            effectif,
            tab_joueurs,
            equipe_joueurs,
            $ligne;

        function redirect(e) {
            window.location.href = '?joueur&id=' + $(e.target).data('idplayer');
        }
        
        $('.page').append(
            /*$('<div/>').addClass('filtres').append(
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-md-2').append(
                        $('<label/>').text('Equipe')
                    ),
                    $('<div/>').addClass('col-md-10').append(
                        $('<select/>').addClass('selectpicker').append(
                            $('<option/>').val('all').text('Toutes')
                        )
                    )
                )
            ),*/
            $('<table/>').addClass('table').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').append(
                $('<thead/>').append(
                    $('<tr/>').append(
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'poste').text('Poste'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'club').text('Club'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'prix_achat').text('Prix d\'achat'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'team_mpg').text('Team MPG')
                    )
                ),
                $('<tbody/>')
            )
        );

        /*for (i = 0; i < clubs.length; i += 1) {
            $('.page .filtres .selectpicker').append($('<option/>').val(clubs[i].id).text(clubs[i].name));
        }*/

        for (effectif in effectifs) {
            if (effectifs.hasOwnProperty(effectif)) {
                tab_joueurs = effectifs[effectif].players;
                equipe_joueurs = effectifs[effectif].name;

                for (i = 0; i < tab_joueurs.length; i += 1) {
                    $ligne = $('<tr/>').attr('data-idplayer', tab_joueurs[i].id).append(
                        $('<td/>').html((tab_joueurs[i].firstname) ? tab_joueurs[i].firstname + ' ' + tab_joueurs[i].lastname : '' + tab_joueurs[i].lastname),
                        $('<td/>').text(postes[tab_joueurs[i].position]),
                        $('<td/>').text(tab_joueurs[i].club),
                        $('<td/>').text(tab_joueurs[i].price_paid),
                        $('<td/>').attr('data-teamid', effectifs[effectif].id).text(equipe_joueurs)
                    ).on('click', redirect);
                    $('.page table tbody').append($ligne);
                }
            }
        }
        // $('.page .filtres .selectpicker').selectpicker('refresh');
        $('.page table').bootstrapTable({
            pagination: true,
            search: true,
            showColumns: true
        });
    });
}

module.exports = {
    getEffectifs: getEffectifs
}