"use strict";

var utils = require('js/utils'),
    home = require('js/home'),
    resultats = require('js/resultats'),
    transferts = require('js/transferts'),
    live = require('js/live'),
    statistiques = require('js/statistiques'),
    classement = require('js/classement'),
    effectifs = require('js/effectifs'),
    ligue1 = require('js/ligue1'),
    pl = require('js/pl'),
    liga = require('js/liga'),
    match = require('js/match'),

    /* Variables gloables */
    teams = [],
    $page = $('.page');

/* Fonctions globales */

function get404() {
    $page.html(
        $('<h1/>').text('La page demandée n\'existe pas !')
    )
}

function loadPage() {
    var path = window.location.search,
        tab = path.split('?')[1].split('&'),
        page = tab[0],
        id = tab[1];

    $page.append(
        $('<div/>').addClass('text-center text-success').append(
            utils.fontAwesomeIcon('spinner fa-pulse fa-3x fa-fw')
        )
    );

    utils.getTeams();
    if (page === 'home') {
        home.getHome();
    } else if (page === 'classement') {
        classement.getClassement();
    } else if (page === 'transferts') {
        transferts.getTransferts();
    } else if (page === 'resultats') {
        resultats.getResultats();
    } else if (page === 'live') {
        live.getLive();
    } else if (page === 'statistiques') {
        statistiques.getStatistiques();
    } else if (page === 'equipes') {
        effectifs.getEffectifs();
    } else if (page === 'match') {
        match.getMatch(id);
    } else if (page === 'ligue1') {
        ligue1.getLigue1();
    } else if (page === 'pl') {
        pl.getPl();
    } else if (page === 'liga') {
        liga.getLiga();
    } else {
        get404();
    }
    // getHome();
}

loadPage();