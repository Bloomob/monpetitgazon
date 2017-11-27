"use strict";

var utils = require('js/utils'),
    api = require('js/api'),
    home = require('js/home'),
    resultats = require('js/resultats'),
    transferts = require('js/transferts'),
    live = require('js/live'),
    statistiques = require('js/statistiques'),
    classement = require('js/classement'),
    effectifs = require('js/effectifs'),
    championnat = require('js/championnat'),
    ligue1 = require('js/ligue1'),
    pl = require('js/pl'),
    liga = require('js/liga'),
    match = require('js/match'),

    /* Variables gloables */
    l,
    ligne,
    teams = [],
    $page = $('.page');

/* Fonction au chargement de la page */
function loadPage() {
    var path = window.location.search,
        tab = (path.length > 0) ? path.split('?')[1].split('&') : [],
        argument1 = tab[0],
        argument2 = tab[1],
        argument3 = tab[2];

    $page.append(
        $('<div/>').addClass('text-center text-success').append(
            utils.fontAwesomeIcon('spinner fa-pulse fa-3x fa-fw')
        )
    );

    $.when(api.getApiDashboard()).then(function(args) {
        utils.setStorage('ligues', args.data.leagues);
        
        for(var l of args.data.leagues) {
            if(l.championship == 1) {
                ligne = $('<li/>').append(
                    $('<a/>').attr('href', "?championnat&" + l.championship + "&" + l.id).append(
                        $('<img/>').attr('src', "images/flag-france.png").attr('alt', l.name).addClass('icones'),
                        l.name
                    )
                );
            } else if(l.championship == 2) {
                ligne = $('<li/>').append(
                    $('<a/>').attr('href', "?championnat&" + l.championship + "&" + l.id).append(
                        $('<img/>').attr('src', "images/flag-angleterre.png").attr('alt', l.name).addClass('icones'),
                        l.name
                    )
                );
            } else {
                ligne = $('<li/>').append(
                    $('<a/>').attr('href', "?championnat&" + l.championship + "&" + l.id).append(
                        $('<img/>').attr('src', "images/flag-espagne.png").attr('alt', l.name).addClass('icones'),
                        l.name
                    )
                );
            }
            $('ul.liste-championnats').append(ligne);
        }
        
        if (argument1 === 'classement') {
            classement.getClassements();
        } else if (argument1 === 'transferts') {
            transferts.getTransferts();
        } else if (argument1 === 'resultats') {
            resultats.getResultats();
        } else if (argument1 === 'live') {
            live.getLive();
        } else if (argument1 === 'statistiques') {
            statistiques.getStatistiques();
        } else if (argument1 === 'equipes') {
            effectifs.getEffectifs();
        } else if (argument1 === 'match') {
            match.getMatch(argument2);
        } else if (argument1 === 'championnat') {
            utils.setStorage('championnat', argument2);
            utils.setStorage('league', argument3);
            championnat.getChampionnat();
        } else if (argument1 === 'ligue1') {
            ligue1.getLigue1();
        } else if (argument1 === 'pl') {
            pl.getPl();
        } else if (argument1 === 'liga') {
            liga.getLiga();
        } else {
            home.getHome();
        }
    });
}

loadPage();