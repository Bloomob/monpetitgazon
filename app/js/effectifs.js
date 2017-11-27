"use strict";

var utils = require('js/utils'),
    api = require('js/api'),
    $page = $('.page'),
    clubs,
    equipes,
    i,
    effectif,
    tab_joueurs,
    equipe_joueurs,
    $ligne;


function redirect(e) {
    window.location.href = '?joueur&id=' + $(e.target).data('idplayer');
}

function loadPageEffectifs(effectifs) {
    clubs = effectifs.teamsid,
    equipes = effectifs.teams,
    
    $('.page').html(
        $('<table/>').addClass('table').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').attr('data-page-size', '50').append(
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

    for (effectif in equipes) {
        if (equipes.hasOwnProperty(effectif)) {
            tab_joueurs = equipes[effectif].players;
            equipe_joueurs = equipes[effectif].name;

            for (i = 0; i < tab_joueurs.length; i += 1) {
                $ligne = $('<tr/>').attr('data-idplayer', tab_joueurs[i].id).append(
                    $('<td/>').html((tab_joueurs[i].firstname) ? tab_joueurs[i].firstname + ' ' + tab_joueurs[i].lastname : '' + tab_joueurs[i].lastname),
                    $('<td/>').text(utils.postes[tab_joueurs[i].position]),
                    $('<td/>').text(tab_joueurs[i].club),
                    $('<td/>').text(tab_joueurs[i].price_paid),
                    $('<td/>').text(equipe_joueurs)
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
}

function getEffectifs() {
    var championnat = 1,
        league = "pVArFY4W1nn";
    
    if(utils.getStorage('effectifs') != null) {
        loadPageEffectifs(utils.getStorage('effectifs').value);
    } else {
        $.when(api.getApiEffectifs(league)).then(function(args){
            utils.setStorage('effectifs', args);
            loadPageEffectifs(args);
        });
    }
}

module.exports = {
    getEffectifs: getEffectifs
}