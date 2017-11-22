"use strict";

function getApiDashboard () {
    return $.get({
        url: "https://api.monpetitgazon.com/user/dashboard",
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiBadge (id) {
    return $.get({
        url: "https://api.monpetitgazon.com/user/badges/" + id,
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiClassement (tokenLeague) {
    return $.get({
        url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/ranking",
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiMatchParId (tokenLeague, id) {
    return $.get({
        url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/results/" + id,
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiEffectifs (tokenLeague) {
    return $.get({
        url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/teams",
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiTransfertsHistorique (tokenLeague) {
    return $.get({
        url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/transfer/history",
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiTransfertsAchats (tokenLeague) {
    return $.get({
        url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/transfer/buy",
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiListeCotes (leagueNumber) {
    return $.get({
        url: "https://api.monpetitgazon.com/quotation/" + leagueNumber,
        headers: { "Authorization": Cookies.get('token') }
    });
}


function getApiListeMatchParJournee (infos) {
    return $.get({
        url: "https://api.monpetitgazon.com/championship/" + infos.championnat + "/calendar/" + infos.day,
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiDetailsMatchParId (matchId) {
    return $.get({
        url: "https://api.monpetitgazon.com/championship/match/" + matchId,
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiDerniereJournee (championship) {
    return $.get({
        url: "https://api.monpetitgazon.com/championship/" + championship + "/calendar/",
        headers: { "Authorization": Cookies.get('token') }
    });
}

function getApiEffectif (tokenLeague) {
    return $.get({
        url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/teams",
        headers: { "Authorization": Cookies.get('token') }
    });
}

module.exports = {
    getApiBadge: getApiBadge,
    getApiDashboard: getApiDashboard,
    getApiClassement: getApiClassement,
    getApiMatchParId: getApiMatchParId,
    getApiEffectifs: getApiEffectifs,
    getApiTransfertsHistorique: getApiTransfertsHistorique,
    getApiTransfertsAchats: getApiTransfertsAchats,
    getApiListeCotes: getApiListeCotes,
    getApiListeMatchParJournee: getApiListeMatchParJournee,
    getApiDetailsMatchParId: getApiDetailsMatchParId,
    getApiDerniereJournee: getApiDerniereJournee,
    getApiEffectif: getApiEffectif
}