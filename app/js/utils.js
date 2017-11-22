"use strict";

var postes = [
    'Aucun',
    'Gardien',
    'Défenseur',
    'Milieu',
    'Attaquant'
],
    teams = [],
    now;

function getTeams() {
    return teams;
}

function fontAwesomeIcon(nom) {
    return $('<i/>').addClass('fa fa-' + nom).attr('aria-hidden', 'true');
}

function classNote(note) {
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
    var expires = new Date();
    expires.setDate(expires.getDay() + 7);

    localStorage.setItem(key, JSON.stringify({value: value, expires: expires}));
}

function isStorage (key) {
    now = new Date();
    if(getStorage(key) != null && getStorage(key).expires < now.getTime()) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    postes: postes,
    getTeams: getTeams,
    fontAwesomeIcon: fontAwesomeIcon,
    classNote: classNote,
    getStorage: getStorage,
    setStorage: setStorage,
    isStorage: isStorage
}