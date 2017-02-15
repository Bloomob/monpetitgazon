"use strict";

var home = require('js/home'),
    resultats = require('js/resultats'),
    transferts = require('js/transferts'),
    live = require('js/live'),
    statistiques = require('js/statistiques'),
    classement = require('js/classement'),
    effectifs = require('js/effectifs'),
    ligue1 = require('js/ligue1'),

    /* Variables gloables */
    postes = [
        'Aucun',
        'Gardien',
        'Défenseur',
        'Milieu',
        'Attaquant'
    ],
    teams = [],
    $page = $('.page');

/* Fonctions globales */

function getTeams() {
    $.ajax({
        url: "ajax/liste.php",
        method: "POST",
        dataType : 'json',
        data: { page: 'effectif' }
    }).done(function (data) {
        var clubs = data.teamsid,
            i;
        
        for (i = 0; i < clubs.length; i += 1) {
            teams.push(clubs[i].name);
        }
    });
}

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

function getMatch() {
    
}

function get404() {
    $page.append(
        $('<h1/>').text('La page demandée n\'existe pas !')
    )
}

function loadPage() {
    var path = window.location.search,
        tab = path.split('?')[1].split('&'),
        page = tab[0];

    getTeams();
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
        getMatch();
    } else if (page === 'ligue1') {
        ligue1.getLigue1();
    } else {
        get404();
    }
    // getHome();
}

loadPage();