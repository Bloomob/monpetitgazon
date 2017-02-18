"use strict";
var postes = [
        'Aucun',
        'Gardien',
        'Défenseur',
        'Milieu',
        'Attaquant'
    ],
    teams = [];

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
        return teams;
    });
}

function fontAwesomeIcon(nom) {
    return $('<i/>').addClass('fa fa-' + nom).attr('aria-hidden', 'true');
}

function classNote (note) {
    if (note >= 7) {
        return 'perf-top';
    } else if (note >= 6) {
        return 'perf-good';
    } else if (note >= 5) {
        return 'perf-normal';
    } else if (note >= 4) {
        return 'perf-bad';
    } else {
        return 'perf-awful';
    }
}

function getStorage (key) {
    if(localStorage.getItem(key) != null) {
        return $.parseJSON(localStorage.getItem(key));
    } else {
        return null;
    }
}

function setStorage (key, value) {
    localStorage.setItem(key, JSON.stringify({value: value}));
}

module.exports = {
    postes: postes,
    getTeams: getTeams,
    fontAwesomeIcon: fontAwesomeIcon,
    classNote: classNote,
    getStorage: getStorage,
    setStorage: setStorage,
}