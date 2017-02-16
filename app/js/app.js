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
    match = require('js/match'),

    /* Variables gloables */
    teams = [],
    $page = $('.page');

/* Fonctions globales */

function seConnecter(email, password) {
    $page.find('alert alert-danger').remove();
    $.post({
        url: "https://api.monpetitgazon.com/user/signIn",
        data: {
            email: email,
            password: password,
            language: "fr-FR"
        },
        dataType: 'json'
    }).done(function(data) {
        console.log(data);
        Cookies.set('token', data.token, { expires: 7 });
        // $page.append(data); 
    }).fail(function(data) {
        $page.find('form').before(
            $('<div/>').addClass('alert alert-danger').attr('role', 'alert').text('Erreur utilisateur / mot de passe incorrect')
        );
    });
}

function get404() {
    $page.append(
        $('<h1/>').text('La page demandée n\'existe pas !')
    )
}

function loadPage() {
    var path = window.location.search,
        tab = path.split('?')[1].split('&'),
        page = tab[0],
        id = tab[1];

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
    } else {
        get404();
    }
    // getHome();
}

loadPage();